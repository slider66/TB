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

export const redirectToCheckout = async (orderId, email, isGuest) => {
  const toastId = toast.loading('Redirigiendo a la pasarela de pago...');
  
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { orderId, email, isGuest },
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