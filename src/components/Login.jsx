import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
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
    // El error ya se maneja en el hook `useAuth`
  };

  const inputVariants = {
    rest: { scale: 1, borderColor: '#d4d4d4' },
    focus: { scale: 1.02, borderColor: '#ff6b35' },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-t-xl rounded-b-none p-0 bg-neutral-100">
            <TabsTrigger value="client" className="py-4 data-[state=active]:bg-white rounded-tl-xl">
              <User className="mr-2 h-4 w-4" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="partner" className="py-4 data-[state=active]:bg-white rounded-tr-xl">
              <Briefcase className="mr-2 h-4 w-4" />
              Partner
            </TabsTrigger>
          </TabsList>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-neutral-800">
              Iniciar Sesión
            </h2>
            <p className="text-center text-neutral-500 mb-6">
              Accede a tu cuenta para gestionar tus documentos.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange focus:outline-none"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="btn-primary w-full text-lg py-4" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Acceder'}
              </Button>
            </form>

            <div className="text-center mt-6 space-y-2">
              <button className="text-sm text-orange hover:underline">
                ¿Has olvidado tu contraseña?
              </button>
              <p className="text-sm text-neutral-500">
                ¿Aún no estas registrado?{' '}
                <button onClick={onSwitchToRegister} className="font-semibold text-orange hover:underline" disabled={loading}>
                  Crea una cuenta
                </button>
              </p>
            </div>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Login;