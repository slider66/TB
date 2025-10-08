import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { supabaseAdmin, jsonResponse } from "../_shared/client.ts";

type ProcessDocumentPayload = {
  storage_path: string;
  bucket?: string;
  document_type: string;
  notes?: string;
  request_id?: string;
};

const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');

async function scanWithVirusTotal(bucket: string, storagePath: string) {
  if (!VIRUSTOTAL_API_KEY) {
    console.warn('[process_document] VIRUSTOTAL_API_KEY no configurada. Saltamos escaneo externo.');
    return { allowed: true, verdict: 'skipped' as const };
  }

  const download = await supabaseAdmin.storage.from(bucket).download(storagePath);

  if (download.error || !download.data) {
    throw new Error(`No se pudo descargar el archivo ${storagePath}`);
  }

  const fileBuffer = await download.data.arrayBuffer();
  const form = new FormData();
  form.append('file', new Blob([fileBuffer]), storagePath.split('/').pop() ?? 'documento');

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`VirusTotal error: ${response.status} - ${errorText}`);
  }

  const malwareReport = await response.json();
  return {
    allowed: true,
    verdict: 'pending_analysis' as const,
    reference: malwareReport?.data?.id,
  };
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método no permitido', { status: 405 });
  }

  let payload: ProcessDocumentPayload;

  try {
    payload = await req.json();
  } catch (error) {
    console.error('[process_document] JSON inválido', error);
    return jsonResponse({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (!payload.storage_path || !payload.document_type) {
    return jsonResponse({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const bucket = payload.bucket ?? 'uploads';

  try {
    const virusScan = await scanWithVirusTotal(bucket, payload.storage_path);

    await supabaseAdmin.from('audit_logs').insert({
      action: 'document.scan_request',
      entity: 'documents',
      entity_id: payload.request_id ?? null,
      metadata: {
        storage_path: payload.storage_path,
        bucket,
        virus_scan: virusScan,
      },
    });
  } catch (error) {
    console.error('[process_document] Falló el escaneo antivirus', error);
    return jsonResponse({ error: 'No se pudo completar el escaneo antivirus' }, { status: 502 });
  }

  try {
    await supabaseAdmin.functions.invoke('simplify_document', {
      body: { ...payload, bucket },
    });
  } catch (error) {
    console.warn('[process_document] La función simplify_document aún no está operativa.', error);
  }

  return jsonResponse({ status: 'accepted', queued_at: new Date().toISOString() }, { status: 202 });
});
