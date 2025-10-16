import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';
const DOCUMENTS_BUCKET = 'documents';
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { file_name, page_count = 0, add_ons, client_user_id } = await req.json();
    if (!file_name) {
      throw new Error('El nombre del archivo es obligatorio.');
    }
    const addOnFlags = add_ons ?? {};
    const includeUrgent = Boolean(addOnFlags.urgent);
    const includeTranslation = Boolean(addOnFlags.translation);
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    // 1. Fetch all relevant services
    const serviceCodes = [
      'UNICO'
    ];
    if (page_count > 10) serviceCodes.push('ADDON_EXTRA_PAGES');
    if (includeUrgent) serviceCodes.push('ADDON_URGENT');
    if (includeTranslation) serviceCodes.push('ADDON_TRANSLATION');
    const { data: servicesData, error: servicesError } = await supabaseAdmin.from('services').select('id, code, base_price_cents, vat_rate').in('code', serviceCodes);
    if (servicesError) throw servicesError;
    const services = servicesData.reduce((acc, s)=>({
        ...acc,
        [s.code]: s
      }), {});
    const baseService = services.UNICO;
    if (!baseService) {
      throw new Error('Servicio principal UNICO no configurado.');
    }
    // 2. Calculate total price
    let total_cents = baseService.base_price_cents;
    const orderItemsPayload = [
      {
        service_id: baseService.id,
        qty: 1,
        unit_price_cents: baseService.base_price_cents,
        vat_rate: baseService.vat_rate
      }
    ];
    if (page_count > 10) {
      const extraBlocks = Math.ceil((page_count - 10) / 10);
      const extraPagesService = services.ADDON_EXTRA_PAGES;
      if (!extraPagesService) {
        throw new Error('Servicio adicional de paginas extra no configurado.');
      }
      total_cents += extraBlocks * extraPagesService.base_price_cents;
      orderItemsPayload.push({
        service_id: extraPagesService.id,
        qty: extraBlocks,
        unit_price_cents: extraPagesService.base_price_cents,
        vat_rate: extraPagesService.vat_rate
      });
    }
    if (includeUrgent) {
      const urgentService = services.ADDON_URGENT;
      if (!urgentService) {
        throw new Error('Servicio adicional urgente no configurado.');
      }
      total_cents += urgentService.base_price_cents;
      orderItemsPayload.push({
        service_id: urgentService.id,
        qty: 1,
        unit_price_cents: urgentService.base_price_cents,
        vat_rate: urgentService.vat_rate
      });
    }
    if (includeTranslation) {
      const translationService = services.ADDON_TRANSLATION;
      if (!translationService) {
        throw new Error('Servicio adicional de traduccion no configurado.');
      }
      total_cents += translationService.base_price_cents;
      orderItemsPayload.push({
        service_id: translationService.id,
        qty: 1,
        unit_price_cents: translationService.base_price_cents,
        vat_rate: translationService.vat_rate
      });
    }
    // 3. Create Case (vinculado al usuario si corresponde)
    const caseInsertPayload: Record<string, unknown> = {
      title: `Pedido: ${file_name}`,
      status: 'new',
      priority: includeUrgent ? 'urgent' : 'normal',
      service_id: baseService.id
    };
    if (client_user_id) {
      caseInsertPayload.client_user_id = client_user_id;
    }
    const { data: caseData, error: caseError } = await supabaseAdmin.from('cases').insert(caseInsertPayload).select('id').single();
    if (caseError) throw caseError;
    // 4. Create Order and link to Case
    const orderInsertPayload: Record<string, unknown> = {
      status: 'draft',
      currency: 'EUR',
      total_cents: total_cents
    };
    if (client_user_id) {
      orderInsertPayload.client_user_id = client_user_id;
    }
    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert(orderInsertPayload).select('id').single();
    if (orderError) throw orderError;
    // 5. Create Order Items and link to Case
    const itemsWithOrderId = orderItemsPayload.map((item)=>({
        ...item,
        order_id: order.id,
        case_id: caseData.id
      }));
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsWithOrderId);
    if (itemsError) throw itemsError;
    // 6. Generate signed URL for upload
    const fileExt = file_name.split('.').pop();
    const sanitizedFilename = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${caseData.id}/${sanitizedFilename}`;
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage.from(DOCUMENTS_BUCKET).createSignedUploadUrl(filePath);
    if (signedUrlError) throw signedUrlError;
    return new Response(JSON.stringify({
      orderId: order.id,
      caseId: caseData.id,
      uploadInfo: {
        ...signedUrlData,
        path: filePath
      }
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
