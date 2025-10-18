import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [caseId, setCaseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      // Maybe navigate to an error page or home
      navigate('/');
      return;
    }

    const findCase = async () => {
      try {
        // Stripe session -> order_id
        const { data: eventData, error: eventError } = await supabase
          .from('webhook_events')
          .select('payload')
          .eq('payload->>id', sessionId)
          .eq('type', 'checkout.session.completed')
          .limit(1)
          .single();

        if (eventError || !eventData) {
          throw new Error('No se encontró la sesión de pago o aún no se ha procesado.');
        }

        const orderId = eventData.payload.metadata.supabase_order_id;
        
        // order_id -> case_id
        const { data: itemData, error: itemError } = await supabase
          .from('order_items')
          .select('case_id')
          .eq('order_id', orderId)
          .limit(1)
          .single();

        if (itemError || !itemData || !itemData.case_id) {
          throw new Error('No se pudo encontrar el caso asociado al pedido.');
        }

        setCaseId(itemData.case_id);

        const timer = setTimeout(() => {
          navigate(`/cases/${itemData.case_id}`);
        }, 5000);

        return () => clearTimeout(timer);

      } catch (error) {
        console.error('Error finding case from session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Give webhook a moment to process
    const initialDelay = setTimeout(() => {
        findCase();
    }, 3000);


    return () => clearTimeout(initialDelay);

  }, [sessionId, navigate]);

  const handleRedirect = () => {
    if (caseId) {
      navigate(`/cases/${caseId}`);
    } else {
      navigate('/panel');
    }
  };


  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-neutral-800 mt-4">
                ¡Pago completado con éxito!
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-orange" />
                  <p className="text-neutral-600 mt-4">Estamos preparando tu caso...</p>
                </div>
              ) : (
                <>
                  <p className="text-neutral-600 mb-6">
                    Gracias por tu confianza. Hemos creado un nuevo caso para ti. Serás redirigido en unos segundos.
                  </p>
                  <Button 
                    onClick={handleRedirect}
                    className="btn-primary w-full"
                    disabled={!caseId}
                  >
                    {caseId ? 'Ir a mi caso' : 'Ir al panel'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
  );
};

export default PaymentSuccessPage;
