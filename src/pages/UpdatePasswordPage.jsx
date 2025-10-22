import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import PasswordStrength, { computeValidation } from '@/components/PasswordStrength';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updateUserPassword, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validation = useMemo(() => computeValidation(password), [password]);
  const isPasswordValid = useMemo(
    () => Object.values(validation).every(Boolean),
    [validation]
  );

  useEffect(() => {
    // This page should only be accessible when the user has followed a password reset link
    // which results in a session with an access_token but potentially no user object yet,
    // or when the onAuthStateChange event has fired with 'PASSWORD_RECOVERY'.
    if (authLoading) {
      return;
    }

    if (!session?.access_token) {
      toast({
        title: 'Acceso no válido',
        description: 'Usa el enlace de tu email para restablecer la Contrasena.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [session, navigate, toast, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast({
        title: 'Contrasena no valida',
        description: 'Necesitas 12 caracteres, mayuscula, minuscula, numero y simbolo.',
        variant: 'destructive',
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: 'Las Contrasenas no coinciden',
        description: 'Por favor, asegúrate de que ambas Contrasenas son iguales.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await updateUserPassword(password);
    setLoading(false);

    if (error) {
      toast({
        title: 'Error al actualizar',
        description: error.message || 'No se pudo actualizar la Contrasena.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Contrasena actualizada!',
        description: 'Tu Contrasena ha sido cambiada. Ya puedes iniciar sesión.',
        className: 'bg-green-500 text-white',
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2 text-neutral-800">
              Crea tu nueva Contrasena
            </h2>
            <p className="text-center text-neutral-500 mb-6">
              Asegúrate de que sea segura y la recuerdes.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nueva Contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <PasswordStrength validation={validation} />
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar nueva Contrasena"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                />
                 <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button
                type="submit"
                className="btn-primary w-full text-lg py-4"
                disabled={loading || !password || password !== confirmPassword || !isPasswordValid}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Actualizar Contrasena'}
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default UpdatePasswordPage;
