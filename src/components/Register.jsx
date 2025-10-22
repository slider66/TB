import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import PasswordStrength from '@/components/PasswordStrength';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const { signUp } = useAuth();
  const { toast } = useToast();

  const passwordValidation = useMemo(() => {
    const length = password.length >= 12;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const number = /\d/.test(password);
    return { length, uppercase, lowercase, specialChar, number };
  }, [password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordValidation).every(Boolean);
  }, [passwordValidation]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive",
      });
      return;
    }
    if (!isPasswordValid) {
      toast({
        title: "Contrasena debil",
        description: "Necesitas 12 caracteres, mayuscula, minuscula, numero y simbolo.",
        variant: "destructive",
      });
      return;
    }
    if (!passwordsMatch) {
      toast({
        title: "Error de Contrasena",
        description: "Las Contrasenas no coinciden.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, {
      full_name: fullName,
      role: 'client'
    });
    setLoading(false);

    if (error) {
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Registro casi completado!",
        description: `Hemos enviado un correo de confirmación a ${email}. Por favor, revisa tu bandeja de entrada.`,
        className: "bg-green-500 text-white",
        duration: 8000,
      });

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    }
  };

  const inputVariants = {
    rest: { scale: 1, borderColor: '#d4d4d4' },
    focus: { scale: 1.02, borderColor: '#ff6b35' },
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-neutral-800">
          Crear Cuenta de Cliente
        </h2>
        <p className="text-center text-neutral-500 mb-6">
          Regístrate para empezar a simplificar tus trámites.
        </p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="rest"
              animate="rest"
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="rest"
              animate="rest"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="rest"
              animate="rest"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contrasena"
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
          
          {password && <PasswordStrength validation={passwordValidation} />}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <motion.input
              variants={inputVariants}
              whileFocus="focus"
              initial="rest"
              animate="rest"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar Contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:outline-none ${!passwordsMatch ? 'border-red-500' : 'border-neutral-300'}`}
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
          {!passwordsMatch && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-1" />
              Las Contrasenas no coinciden.
            </div>
          )}
          <Button type="submit" className="btn-primary w-full text-lg py-4" disabled={loading || !isPasswordValid || !passwordsMatch}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Registrarse'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-500">
            ¿Ya tienes una cuenta?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-orange hover:underline" disabled={loading}>
              Inicia sesión
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
