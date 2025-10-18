import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PanelPage = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-neutral-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold text-neutral-800">
                Bienvenido a tu Panel, {user?.user_metadata?.full_name || 'Usuario'}!
              </h1>
              <p className="mt-2 text-neutral-600">
                Este es tu centro de operaciones. Aquí podrás gestionar tus casos, subir nuevos documentos y mucho más.
              </p>
              <p className="text-sm text-neutral-500 mt-1">Email: {user?.email}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-lg shadow p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">Mis Casos</h2>
                  <p className="text-neutral-600 mb-4">Ver el estado de tus traducciones.</p>
                   <Button onClick={() => alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀")} className="btn-secondary">Ver Casos</Button>
               </motion.div>
               <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-lg shadow p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">Subir Documento</h2>
                  <p className="text-neutral-600 mb-4">Inicia un nuevo trámite de traducción.</p>
                  <Button onClick={() => navigate('/upload')} className="btn-primary">Subir Ahora</Button>
               </motion.div>
               <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-lg shadow p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>
                  <p className="text-neutral-600 mb-4">Actualiza tus datos y contraseña.</p>
                  <Button onClick={() => alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀")} className="btn-secondary">Editar Perfil</Button>
               </motion.div>
            </div>

            <div className="mt-12 text-center">
              <Button onClick={handleSignOut} variant="destructive">
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
  );
};

export default PanelPage;
