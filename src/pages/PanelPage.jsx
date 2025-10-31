import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Loader2, FolderOpen, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import UserCases from '@/components/client/UserCases';
import UserProfile from '@/components/client/UserProfile';

const PanelPage = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('casos');

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
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-neutral-800">
              Bienvenido a tu Panel, {user?.user_metadata?.full_name || 'Usuario'}!
            </h1>
            <p className="mt-2 text-neutral-600">
              Este es tu centro de operaciones. Aquí podrás gestionar tus casos, subir nuevos documentos y mucho más.
            </p>
            <p className="text-sm text-neutral-500 mt-1">Email: {user?.email}</p>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="casos" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Mis Casos
              </TabsTrigger>
              <TabsTrigger value="perfil" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Mi Perfil
              </TabsTrigger>
            </TabsList>

            {/* Mis Casos Tab */}
            <TabsContent value="casos">
              <div className="bg-white rounded-lg shadow-md p-6">
                <UserCases />
              </div>
            </TabsContent>

            {/* Mi Perfil Tab */}
            <TabsContent value="perfil">
              <div className="bg-white rounded-lg shadow-md p-6">
                <UserProfile />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
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
