import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabaseAdmin =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

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

    if (supabaseAdmin) {
      const composedMetadata: Record<string, unknown> = {
        ...(metadata ?? {}),
        ...(phone ? { phone } : {}),
        ...(userId ? { userId } : {}),
      };

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
        return jsonResponse(
          {
            error: 'Failed to store contact request.',
            details: insertError.message ?? insertError,
          },
          500,
        );
      }
    } else {
      console.warn(
        'Supabase admin client not initialised. Contact messages will not be stored.',
      );
      return jsonResponse(
        { error: 'Supabase admin client not initialised on the edge function.' },
        500,
      );
    }

    return jsonResponse({ success: true });
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
