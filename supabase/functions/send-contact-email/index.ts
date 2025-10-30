import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.8.0/mod.ts';
import { corsHeaders } from './cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;
const notificationEmail =
  Deno.env.get('CONTACT_NOTIFICATION_EMAIL') ?? 'hola@traductorburocratico.es';

const smtpConfig = {
  host: Deno.env.get('SMTP_HOST') ?? undefined,
  port: Number(Deno.env.get('SMTP_PORT') ?? '465'),
  secure: (Deno.env.get('SMTP_SECURE') ?? 'true').toLowerCase() !== 'false',
  user: Deno.env.get('SMTP_USER') ?? undefined,
  pass: Deno.env.get('SMTP_PASS') ?? undefined,
  from: Deno.env.get('SMTP_FROM') ?? Deno.env.get('SMTP_USER') ?? undefined,
  fromName: Deno.env.get('SMTP_FROM_NAME') ?? 'Traductor Burocratico',
};

const smtpConfigValid =
  Boolean(smtpConfig.host) &&
  Boolean(smtpConfig.user) &&
  Boolean(smtpConfig.pass) &&
  Boolean(smtpConfig.from);

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  phone?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

const htmlEscapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

type EmailPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown>;
  userId?: string | null;
};

async function sendNotificationEmail(payload: EmailPayload) {
  if (!smtpConfigValid) {
    console.warn('SMTP configuration incomplete. Skipping notification email.');
    return { success: false, skipped: true, reason: 'missing_smtp_config' };
  }

  if (!notificationEmail) {
    console.warn('Notification email address not configured. Skipping email send.');
    return { success: false, skipped: true, reason: 'missing_recipient' };
  }

  const client = new SmtpClient();
  const subjectParts = ['Nuevo mensaje recibido'];
  if (payload.source) {
    subjectParts.push(`(${payload.source})`);
  }
  subjectParts.push(`de ${payload.name}`);
  const subject = subjectParts.join(' ');

  const metadataBlock =
    payload.metadata && Object.keys(payload.metadata).length > 0
      ? JSON.stringify(payload.metadata, null, 2)
      : null;

  const plainSections = [
    'Nuevo mensaje recibido:',
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Telefono: ${payload.phone}` : null,
    payload.source ? `Origen: ${payload.source}` : null,
    payload.userId ? `User ID: ${payload.userId}` : null,
    '',
    'Mensaje:',
    payload.message,
    '',
    metadataBlock ? `Metadata:\n${metadataBlock}` : null,
  ].filter(Boolean);

  const plainContent = plainSections.join('\n');

  const htmlSections = [
    '<h2>Nuevo mensaje recibido</h2>',
    '<ul>',
    `<li><strong>Nombre:</strong> ${escapeHtml(payload.name)}</li>`,
    `<li><strong>Email:</strong> ${escapeHtml(payload.email)}</li>`,
    payload.phone ? `<li><strong>Telefono:</strong> ${escapeHtml(payload.phone)}</li>` : '',
    payload.source ? `<li><strong>Origen:</strong> ${escapeHtml(payload.source)}</li>` : '',
    payload.userId ? `<li><strong>User ID:</strong> ${escapeHtml(payload.userId)}</li>` : '',
    '</ul>',
    '<p><strong>Mensaje:</strong></p>',
    `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;font-family:monospace;">${escapeHtml(payload.message)}</pre>`,
    metadataBlock
      ? `<p><strong>Metadata:</strong></p><pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;font-family:monospace;">${escapeHtml(
          metadataBlock,
        )}</pre>`
      : '',
  ].join('');

  try {
    if (smtpConfig.secure) {
      await client.connectTLS({
        hostname: smtpConfig.host!,
        port: smtpConfig.port,
        username: smtpConfig.user!,
        password: smtpConfig.pass!,
      });
    } else {
      await client.connect({
        hostname: smtpConfig.host!,
        port: smtpConfig.port,
        username: smtpConfig.user!,
        password: smtpConfig.pass!,
      });
    }

    const fromHeader = smtpConfig.fromName
      ? `${smtpConfig.fromName} <${smtpConfig.from}>`
      : smtpConfig.from!;

    await client.send({
      from: fromHeader,
      to: notificationEmail,
      subject,
      content: plainContent,
      html: htmlSections,
    });

    await client.close();
    return { success: true };
  } catch (error) {
    console.error('Failed to send notification email:', error);
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload = (await req.json()) as ContactPayload;
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const message = payload.message?.trim();
    const phone = payload.phone?.trim();
    const source = payload.source?.trim() || null;
    const userId = payload.userId?.trim() || null;
    const metadata =
      payload.metadata && typeof payload.metadata === 'object'
        ? payload.metadata
        : undefined;

    if (!name || !email || !message) {
      return jsonResponse(
        { error: 'Missing required fields: name, email and message are mandatory.' },
        400,
      );
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
      return jsonResponse({ error: 'Invalid email format.' }, 400);
    }

    if (message.length > 5000) {
      return jsonResponse({ error: 'Message is too long.' }, 400);
    }

    const composedMetadata: Record<string, unknown> = {
      ...(metadata ?? {}),
      ...(phone ? { phone } : {}),
      ...(userId ? { userId } : {}),
    };

    let stored = false;

    if (supabaseAdmin) {
      const insertPayload: Record<string, unknown> = {
        name,
        email,
        message,
        source,
        metadata: Object.keys(composedMetadata).length > 0 ? composedMetadata : null,
      };

      const { error: insertError } = await supabaseAdmin
        .from('contact_messages')
        .insert(insertPayload);

      if (insertError) {
        console.error('Failed to insert contact message:', insertError);
      } else {
        stored = true;
      }
    } else {
      console.warn('Supabase admin client not initialised. Skipping contact message storage.');
    }

    const emailResult = await sendNotificationEmail({
      name,
      email,
      message,
      phone,
      source,
      metadata: Object.keys(composedMetadata).length > 0 ? composedMetadata : undefined,
      userId,
    });

    if (!emailResult.success) {
      console.error('Notification email failed to send.', emailResult);
    }

    return jsonResponse({
      success: true,
      stored,
      emailDispatched: emailResult.success,
      ...(emailResult.success
        ? {}
        : { emailError: emailResult.error ?? emailResult.reason ?? 'email_failed' }),
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    const detail =
      error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
    return jsonResponse(
      {
        error: 'Failed to process contact request.',
        details: detail,
      },
      500,
    );
  }
});
