import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, LogIn } from 'lucide-react';

const AuthConfirmPage = ({ onLoginClick }) => {
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
              ¡Cuenta Verificada!
            </h1>
            <p className="mt-2 text-md text-neutral-600">
              Tu dirección de correo electrónico ha sido confirmada exitosamente. Ya puedes iniciar sesión y empezar a utilizar nuestros servicios.
            </p>
            <div className="mt-8">
              <Button onClick={onLoginClick} className="btn-primary w-full max-w-xs mx-auto text-lg py-4">
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default AuthConfirmPage;
