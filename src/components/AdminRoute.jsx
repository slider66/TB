
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center items-center h-screen text-center"
      >
        <h1 className="text-4xl font-bold text-red-500">Acceso Denegado</h1>
        <p className="text-xl mt-4">No tienes permisos para acceder a esta página.</p>
        <Navigate to="/" replace />
      </motion.div>
    );
  }

  return children;
};

export default AdminRoute;
