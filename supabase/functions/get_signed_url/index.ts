import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { supabaseAdmin, jsonResponse } from "../_shared/client.ts";

type SignedUrlPayload = {
  bucket: string;
  path: string;
  expires_in?: number;
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas para get_signed_url.');
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Token JWT requerido' }, { status: 401 });
  }

  let payload: SignedUrlPayload;

  try {
    payload = await req.json();
  } catch (error) {
    console.error('[get_signed_url] JSON inválido', error);
    return jsonResponse({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!payload.bucket || !payload.path) {
    return jsonResponse({ error: 'bucket y path son obligatorios' }, { status: 400 });
  }

  const expiresIn = Math.min(payload.expires_in ?? 60, 300); // Máx. 5 minutos

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  const { data: document, error: accessError } = await userClient
    .from('documents')
    .select('id')
    .eq('storage_path', payload.path)
    .single();

  if (accessError || !document) {
    console.warn('[get_signed_url] Acceso denegado para', payload.path, accessError);
    return jsonResponse({ error: 'No autorizado' }, { status: 403 });
  }

  const { data: signedUrl, error } = await supabaseAdmin.storage
    .from(payload.bucket)
    .createSignedUrl(payload.path, expiresIn);

  if (error || !signedUrl) {
    console.error('[get_signed_url] No fue posible generar la URL firmada', error);
    return jsonResponse({ error: 'No se pudo generar la URL' }, { status: 500 });
  }

  return jsonResponse({ url: signedUrl.signedUrl, expires_in: expiresIn }, { status: 200 });
});
