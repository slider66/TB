import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Lock, CreditCard, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MiPerfil = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Datos del perfil
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  // Datos de facturación
  const [billingData, setBillingData] = useState({
    billing_name: '',
    billing_tax_id: '',
    billing_address: '',
    billing_city: '',
    billing_postal_code: '',
    billing_country: 'España'
  });

  // Cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Obtener datos del perfil
      const { data: appUserData, error: appUserError } = await supabase
        .from('app_users')
        .select('full_name, email, phone')
        .eq('user_id', user.id)
        .single();

      if (appUserError && appUserError.code !== 'PGRST116') throw appUserError;

      if (appUserData) {
        setProfileData({
          full_name: appUserData.full_name || '',
          email: appUserData.email || user.email || '',
          phone: appUserData.phone || ''
        });
      }

      // Obtener datos de facturación del cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('billing_address, billing_info')
        .eq('user_id', user.id)
        .single();

      if (clientError && clientError.code !== 'PGRST116') throw clientError;

      if (clientData) {
        const billing = clientData.billing_info || {};
        const address = clientData.billing_address || {};
        
        setBillingData({
          billing_name: billing.name || '',
          billing_tax_id: billing.tax_id || '',
          billing_address: address.street || '',
          billing_city: address.city || '',
          billing_postal_code: address.postal_code || '',
          billing_country: address.country || 'España'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos del perfil' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('app_users')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleBillingUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          billing_info: {
            name: billingData.billing_name,
            tax_id: billingData.billing_tax_id
          },
          billing_address: {
            street: billingData.billing_address,
            city: billingData.billing_city,
            postal_code: billingData.billing_postal_code,
            country: billingData.billing_country
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Datos de facturación actualizados correctamente' });
    } catch (error) {
      console.error('Error updating billing:', error);
      setMessage({ type: 'error', text: 'Error al actualizar los datos de facturación' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Mi Perfil</h2>
        <p className="text-neutral-600">Gestiona tu información personal y de facturación</p>
      </div>

      {/* Mensajes */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Información Personal */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-5 w-5 text-orange" />
          <h3 className="text-xl font-semibold text-neutral-800">Información Personal</h3>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-neutral-500 mt-1">El email no se puede modificar</p>
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="+34 600 000 000"
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Perfil'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Datos de Facturación */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-5 w-5 text-orange" />
          <h3 className="text-xl font-semibold text-neutral-800">Datos de Facturación</h3>
        </div>
        
        <form onSubmit={handleBillingUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_name">Nombre Fiscal</Label>
              <Input
                id="billing_name"
                value={billingData.billing_name}
                onChange={(e) => setBillingData({ ...billingData, billing_name: e.target.value })}
                placeholder="Nombre o razón social"
              />
            </div>

            <div>
              <Label htmlFor="billing_tax_id">NIF/CIF</Label>
              <Input
                id="billing_tax_id"
                value={billingData.billing_tax_id}
                onChange={(e) => setBillingData({ ...billingData, billing_tax_id: e.target.value })}
                placeholder="12345678A"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billing_address">Dirección</Label>
            <Input
              id="billing_address"
              value={billingData.billing_address}
              onChange={(e) => setBillingData({ ...billingData, billing_address: e.target.value })}
              placeholder="Calle, número, piso"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="billing_city">Ciudad</Label>
              <Input
                id="billing_city"
                value={billingData.billing_city}
                onChange={(e) => setBillingData({ ...billingData, billing_city: e.target.value })}
                placeholder="Madrid"
              />
            </div>

            <div>
              <Label htmlFor="billing_postal_code">Código Postal</Label>
              <Input
                id="billing_postal_code"
                value={billingData.billing_postal_code}
                onChange={(e) => setBillingData({ ...billingData, billing_postal_code: e.target.value })}
                placeholder="28001"
              />
            </div>

            <div>
              <Label htmlFor="billing_country">País</Label>
              <Input
                id="billing_country"
                value={billingData.billing_country}
                onChange={(e) => setBillingData({ ...billingData, billing_country: e.target.value })}
                placeholder="España"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Datos de Facturación'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Cambiar Contraseña */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-orange" />
          <h3 className="text-xl font-semibold text-neutral-800">Cambiar Contraseña</h3>
        </div>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="new_password">Nueva Contraseña</Label>
            <Input
              id="new_password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <Label htmlFor="confirm_password">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirm_password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cambiando...
                </>
              ) : (
                'Cambiar Contraseña'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MiPerfil;
