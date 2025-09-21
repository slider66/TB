import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ClientDashboard from '@/components/client/ClientDashboard';

const ClientsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 py-20">
        <div>
          <h1 className="text-3xl font-bold text-orange mb-4">Acceso Denegado</h1>
          <p className="text-xl text-neutral-600 mb-8">Debes iniciar sesión para ver esta página.</p>
          <Button onClick={() => navigate('/')} className="btn-primary">Volver al Inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">
            Mis Expedientes
          </h1>
          <p className="text-xl text-neutral-600">
            Gestiona todos tus documentos y trámites en un solo lugar
          </p>
        </motion.div>

        <ClientDashboard />
        
      </div>
    </div>
  );
};

export default ClientsPage;