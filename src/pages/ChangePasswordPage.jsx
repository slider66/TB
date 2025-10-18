import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import PasswordStrength from '@/components/PasswordStrength';
import { supabase } from '@/lib/customSupabaseClient';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast({
        title: 'Contraseña no segura',
        description: 'Por favor, cumple todos los requisitos de seguridad para la contraseña.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Las contraseñas no coinciden',
        description: 'La nueva contraseña y su confirmación deben ser iguales.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // First, verify the current password by trying to sign in with it.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      toast({
        title: 'Contraseña actual incorrecta',
        description: 'La contraseña actual que has introducido no es válida.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // If current password is correct, update to the new password.
    const { error: updateError } = await updateUserPassword(newPassword);

    setLoading(false);

    if (updateError) {
      toast({
        title: 'Error al actualizar',
        description: updateError.message || 'No se pudo cambiar la contraseña.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Contraseña cambiada!',
        description: 'Tu contraseña ha sido actualizada correctamente.',
        className: 'bg-green-500 text-white',
      });
      navigate('/panel');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2 text-neutral-800">
              Cambiar Contraseña
            </h2>
            <p className="text-center text-neutral-500 mb-6">
              Introduce tu contraseña actual y elige una nueva.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {newPassword && <PasswordStrength validation={passwordValidation} />}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                  required
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
                disabled={loading || !currentPassword || !newPassword || !isPasswordValid || newPassword !== confirmPassword}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cambiar Contraseña'}
              </Button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ChangePasswordPage;
