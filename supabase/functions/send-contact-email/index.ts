import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { jsonResponse } from "../_shared/client.ts";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  captchaToken?: string;
};

const TURNSTILE_SECRET = Deno.env.get('TURNSTILE_SECRET');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const CONTACT_INBOX = Deno.env.get('CONTACT_INBOX') ?? 'hola@traductorburocratico.es';

async function verifyTurnstileToken(token: string | undefined, remoteIp?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.warn('[send-contact-email] TURNSTILE_SECRET no configurado. Skip temporal de verificación.');
    return true;
  }

  if (!token) {
    return false;
  }

  const params = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token,
  });

  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    console.error('[send-contact-email] Turnstile verification failed', response.status, await response.text());
    return false;
  }

  const payload = await response.json();
  return Boolean(payload.success);
}

async function deliverEmail(payload: ContactPayload) {
  if (!RESEND_API_KEY) {
    console.warn('[send-contact-email] RESEND_API_KEY no configurado. Registramos el mensaje en logs.');
    console.info('Mensaje entrante', payload);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Traductor Burocrático <no-reply@traductorburocratico.es>',
      to: [CONTACT_INBOX],
      subject: `[Contacto] ${payload.subject}`,
      text: `Nombre: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
    }),
  });
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  let body: ContactPayload;

  try {
    body = await req.json();
  } catch (error) {
    console.error('[send-contact-email] JSON inválido', error);
    return jsonResponse({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!body.name || !body.email || !body.subject || !body.message) {
    return jsonResponse({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const remoteIp = req.headers.get('cf-connecting-ip') ?? undefined;
  const isHuman = await verifyTurnstileToken(body.captchaToken, remoteIp);

  if (!isHuman) {
    return jsonResponse({ error: 'Verificación CAPTCHA fallida' }, { status: 400 });
  }

  await deliverEmail(body);

  return jsonResponse({ status: 'queued' }, { status: 202 });
});
