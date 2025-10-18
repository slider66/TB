import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentCancelledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-neutral-800 mt-4">
                El pago ha sido cancelado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-6">
                Parece que has cancelado el proceso de pago. Si ha sido un error, puedes volver a intentarlo.
              </p>
              <Button 
                onClick={() => navigate('/pricing')}
                className="btn-secondary w-full"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver a los planes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
  );
};

export default PaymentCancelledPage;
