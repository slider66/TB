import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';
import Stripe from 'https://esm.sh/stripe@11.1.0';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient()
});
async function getOrCreateStripeCustomer(supabaseAdmin, email, userId) {
  if (userId) {
    const { data: appUser, error: appUserError } = await supabaseAdmin.from('app_users').select('stripe_customer_id').eq('user_id', userId).single();
    if (appUserError) throw appUserError;
    if (appUser.stripe_customer_id) return appUser.stripe_customer_id;
  }
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      supabase_user_id: userId || 'guest'
    }
  });
  if (userId) {
    const { error: updateError } = await supabaseAdmin.from('app_users').update({
      stripe_customer_id: customer.id
    }).eq('user_id', userId);
    if (updateError) console.error("Failed to link Stripe customer to user:", updateError);
  }
  return customer.id;
}
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { orderId, email, isGuest } = await req.json();
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    const { data: order, error: orderError } = await supabaseAdmin.from('orders').select('*, order_items(*, services(stripe_price_id))').eq('id', orderId).single();
    if (orderError || !order) throw orderError || new Error('Order not found');
    const lineItems = order.order_items.map((item)=>({
        price: item.services.stripe_price_id,
        quantity: item.qty
      }));
    let customerId;
    if (order.client_user_id) {
      customerId = await getOrCreateStripeCustomer(supabaseAdmin, email, order.client_user_id);
    } else {
      customerId = await getOrCreateStripeCustomer(supabaseAdmin, email, null);
    }
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${Deno.env.get('VITE_APP_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('VITE_APP_URL')}/payment/cancelled`,
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      metadata: {
        supabase_order_id: order.id,
        is_guest: isGuest
      },
      ...isGuest && {
        consent_collection: {
          terms_of_service: 'required'
        }
      }
    });
    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
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
