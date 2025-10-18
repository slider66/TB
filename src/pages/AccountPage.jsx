import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, Save, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('app_users')
          .select('full_name, email, phone')
          .eq('user_id', user.id)
          .single();

        if (error) {
          toast({
            title: 'Error al cargar el perfil',
            description: 'No se pudieron obtener los datos de tu perfil.',
            variant: 'destructive',
          });
        } else if (data) {
          setProfile(data);
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('app_users')
      .update({ full_name: profile.full_name, phone: profile.phone })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo guardar tu perfil. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Perfil actualizado!',
        description: 'Tus datos se han guardado correctamente.',
        className: 'bg-green-500 text-white',
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-800 mb-8">Mi Cuenta</h1>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6">Información Personal</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nombre completo"
                  value={profile.full_name || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={saving}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={profile.email || ''}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg bg-neutral-100 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono (opcional)"
                  value={profile.phone || ''}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={saving}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar Cambios
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/account/change-password')}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Cambiar Contraseña
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default AccountPage;
