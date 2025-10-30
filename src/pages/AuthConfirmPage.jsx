import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TBButton } from '@/components/ui';
import { CheckCircle, LogIn, ArrowRight } from 'lucide-react';

const AuthConfirmPage = ({ onLoginClick }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verified = searchParams.get('verified') === 'true';

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };

  const handlePanelClick = () => {
    navigate('/panel');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            </motion.div>
            <h1 className="mt-6 text-3xl font-extrabold text-neutral-900">
              {verified ? '¡Cuenta Activada!' : '¡Cuenta Verificada!'}
            </h1>
            <p className="mt-2 text-md text-neutral-600">
              {verified 
                ? 'Tu cuenta ha sido activada exitosamente. ¡Gracias por verificar tu correo electrónico! Ya puedes acceder a todos nuestros servicios.'
                : 'Tu dirección de correo electrónico ha sido confirmada exitosamente. Ya puedes iniciar sesión y empezar a utilizar nuestros servicios.'
              }
            </p>
            <div className="mt-8 space-y-3">
              {verified ? (
                <TBButton onClick={handlePanelClick} variant="primary" size="lg" className="w-full max-w-xs mx-auto">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Ir al Panel
                </TBButton>
              ) : (
                <TBButton onClick={handleLoginClick} variant="primary" size="lg" className="w-full max-w-xs mx-auto">
                  <LogIn className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </TBButton>
              )}
            </div>
            {verified && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-green-600 font-semibold"
              >
                ✓ Cuenta activada con éxito
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
  );
};

export default AuthConfirmPage;
