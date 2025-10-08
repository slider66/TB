import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { supabaseAdmin, jsonResponse } from '../_shared/client.ts';

type SimplifyPayload = {
  storage_path: string;
  bucket?: string;
  document_type: string;
  notes?: string;
  request_id?: string;
};

async function upsertAnalysis(payload: SimplifyPayload, summary: string) {
  if (!payload.request_id) {
    return;
  }

  await supabaseAdmin
    .from('analyses')
    .upsert(
      {
        request_id: payload.request_id,
        ai_summary: summary,
        ai_flags: { generated_at: new Date().toISOString() },
        human_review: false,
      },
      { onConflict: 'request_id' },
    );

  await supabaseAdmin
    .from('requests')
    .update({ status: 'ready' })
    .eq('id', payload.request_id);
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Metodo no permitido', { status: 405 });
  }

  let payload: SimplifyPayload;

  try {
    payload = await req.json();
  } catch (error) {
    console.error('[simplify_document] JSON invalido', error);
    return jsonResponse({ error: 'Solicitud invalida' }, { status: 400 });
  }

  if (!payload.storage_path) {
    return jsonResponse({ error: 'storage_path requerido' }, { status: 400 });
  }

  const placeholderSummary = 'Documento procesado (' + (payload.document_type ?? 'desconocido') + '). Pendiente de integracion con el motor IA.';

  await upsertAnalysis(payload, placeholderSummary);

  return jsonResponse({ status: 'ready', message: 'Se generara el resumen y se notificara al usuario.' });
});
