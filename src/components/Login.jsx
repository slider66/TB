import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { TBButton } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const inputVariants = {
  rest: { scale: 1, borderColor: '#d4d4d4' },
  focus: { scale: 1.02, borderColor: '#ff6b35' },
};

const EmailInput = ({ value, onChange, disabled }) => (
  <div className="relative">
    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
    <motion.input
      variants={inputVariants}
      whileFocus="focus"
      initial="rest"
      animate="rest"
      type="email"
      placeholder="Email"
      value={value}
      onChange={onChange}
      className="w-full pl-8 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-tb-primary focus:outline-none placeholder:text-neutral-400"
      disabled={disabled}
    />
  </div>
);

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('login'); // 'login' or 'forgotPassword'
  const { signIn, sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, introduce tu email y contraseña.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (!error) {
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: `Bienvenido de nuevo.`,
        className: "bg-green-500 text-white",
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor, introduce tu dirección de email.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    await sendPasswordResetEmail(email);
    setLoading(false);
    setView('login');
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {view === 'login' && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1 text-neutral-800">
              Iniciar Sesión
            </h2>
            <p className="text-center text-neutral-500 text-sm mb-5">
              Accede a tu cuenta para gestionar tus documentos.
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
                <EmailInput 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                />
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                  <motion.input
                    variants={inputVariants}
                    whileFocus="focus"
                    initial="rest"
                    animate="rest"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-tb-primary focus:outline-none placeholder:text-neutral-400"
                    disabled={loading}
                  />
                </div>
              <TBButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Acceder'}
              </TBButton>
            </form>

            <div className="text-center mt-4 space-y-2">
              <button onClick={() => setView('forgotPassword')} className="text-sm text-tb-primary hover:underline">
                ¿Has olvidado tu contraseña?
              </button>
              <p className="text-sm text-neutral-500">
                ¿Aún no estas registrado?{' '}
                <button onClick={onSwitchToRegister} className="font-semibold text-tb-primary hover:underline" disabled={loading}>
                  Crea una cuenta
                </button>
              </p>
            </div>
          </div>
        )}

        {view === 'forgotPassword' && (
          <div>
             <button onClick={() => setView('login')} className="flex items-center text-sm text-neutral-600 hover:text-tb-primary mb-3">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a inicio de sesión
            </button>
            <h2 className="text-xl font-bold text-center mb-1 text-neutral-800">
              Restablecer Contraseña
            </h2>
            <p className="text-center text-neutral-500 text-sm mb-5">
              Introduce tu email para recibir instrucciones.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <EmailInput 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
              />
              <TBButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Enviar instrucciones'}
              </TBButton>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
