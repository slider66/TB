import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { User, Mail, Phone, MapPin, Lock, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const ClientProfile = () => {
  const { user, updateUserPassword } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select(`
            phone,
            billing_address,
            app_users (
              full_name
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setProfileData({
            full_name: data.app_users?.full_name || '',
            phone: data.phone || '',
            address: data.billing_address?.address || '',
            city: data.billing_address?.city || '',
            postalCode: data.billing_address?.postalCode || '',
            country: data.billing_address?.country || ''
          });
        }
      } catch (error) {
        toast({
          title: "Error al cargar el perfil",
          description: "No se pudo recuperar la información de tu perfil.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { error: appUserError } = await supabase
        .from('app_users')
        .update({ full_name: profileData.full_name })
        .eq('user_id', user.id);

      if (appUserError) throw appUserError;
      
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          phone: profileData.phone,
          billing_address: {
            address: profileData.address,
            city: profileData.city,
            postalCode: profileData.postalCode,
            country: profileData.country,
          }
        })
        .eq('user_id', user.id);

      if (clientError) throw clientError;

      toast({
        title: "¡Perfil actualizado!",
        description: "Tu información ha sido guardada correctamente.",
        className: "bg-green-500 text-white",
      });

    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo actualizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las nuevas contraseñas no coinciden.",
        variant: "destructive"
      });
      return;
    }
    if (passwordData.newPassword.length < 10) {
        toast({
        title: "Contraseña demasiado corta",
        description: "La nueva contraseña debe tener al menos 10 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setLoadingPassword(true);
    const { error } = await updateUserPassword(passwordData.newPassword);

    if (error) {
       toast({
        title: "Error al cambiar la contraseña",
        description: error.message,
        variant: "destructive"
      });
    } else {
       toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada con éxito.",
        className: "bg-green-500 text-white",
      });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    setLoadingPassword(false);
  };

  const inputVariants = {
    rest: { scale: 1, borderColor: '#d4d4d4' },
    focus: { scale: 1.01, borderColor: '#ff6b35' },
  };

  const InputField = ({ icon, name, placeholder, value, onChange, type = "text", disabled = false }) => (
    <div className="relative">
      {React.cloneElement(icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" })}
      <motion.input
        variants={inputVariants}
        whileFocus="focus"
        initial="rest"
        animate="rest"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
        disabled={disabled}
      />
    </div>
  );
  
  if (loadingData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-orange" /></div>;
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 gap-8"
    >
      <div className="document-card">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Datos de Contacto y Facturación</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <InputField icon={<User />} name="full_name" placeholder="Nombre Completo" value={profileData.full_name} onChange={handleProfileChange} disabled={loadingProfile}/>
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
            />
          </div>

          <InputField icon={<Phone />} name="phone" placeholder="Teléfono de Contacto" value={profileData.phone} onChange={handleProfileChange} disabled={loadingProfile}/>
          <InputField icon={<MapPin />} name="address" placeholder="Dirección" value={profileData.address} onChange={handleProfileChange} disabled={loadingProfile}/>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="city" placeholder="Ciudad" value={profileData.city} onChange={handleProfileChange} className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" disabled={loadingProfile}/>
            <input name="postalCode" placeholder="Código Postal" value={profileData.postalCode} onChange={handleProfileChange} className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" disabled={loadingProfile}/>
            <input name="country" placeholder="País" value={profileData.country} onChange={handleProfileChange} className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none" disabled={loadingProfile}/>
          </div>

          <Button type="submit" className="btn-primary w-full text-lg py-4 mt-4" disabled={loadingProfile}>
            {loadingProfile ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            {loadingProfile ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </div>

      <div className="document-card">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <InputField icon={<Lock />} name="newPassword" placeholder="Nueva Contraseña" value={passwordData.newPassword} onChange={handlePasswordChange} type="password" disabled={loadingPassword}/>
          <InputField icon={<Lock />} name="confirmPassword" placeholder="Confirmar Nueva Contraseña" value={passwordData.confirmPassword} onChange={handlePasswordChange} type="password" disabled={loadingPassword}/>
          
          <Button type="submit" className="btn-secondary w-full text-lg py-4 mt-4" disabled={loadingPassword}>
            {loadingPassword ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Actualizar Contraseña'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ClientProfile;