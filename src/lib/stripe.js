
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/customSupabaseClient';
import toast from 'react-hot-toast';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const redirectToCheckout = async (plan, urgent = false) => {
  const toastId = toast.loading('Redirigiendo a la pasarela de pago...');
  
  try {
    const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();

    if (authError || !authSession) {
      throw new Error('Debes iniciar sesión para realizar una compra.');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { plan, urgent },
      headers: {
        Authorization: `Bearer ${authSession.access_token}`,
      }
    });

    if (error) {
      throw new Error(`Error del servidor: ${error.message}`);
    }

    if (!data.url) {
      throw new Error('No se pudo generar la URL de pago.');
    }
    
    toast.success('¡Todo listo! Serás redirigido.', { id: toastId });
    window.location.href = data.url;

  } catch (error) {
    console.error("Error al redirigir al checkout:", error);
    toast.error(`Error: ${error.message}`, { id: toastId });
  }
};

export default getStripe;
