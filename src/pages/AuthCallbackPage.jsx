import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // This effect runs when the component mounts and whenever the session or loading state changes.
    // It's responsible for redirecting the user after the authentication flow.

    // If the authentication process is still loading, we don't do anything yet.
    if (loading) {
      return;
    }

    // Check for an error passed in the URL from Supabase (e.g., expired token)
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
        toast({
            title: 'Error de Autenticación',
            description: errorDescription || 'El enlace de verificación ha expirado o no es válido. Por favor, intenta iniciar sesión de nuevo.',
            variant: 'destructive',
            duration: 8000,
        });
        navigate('/login?error=link');
        return;
    }

    // Check the type parameter to determine if this is an email confirmation
    const type = searchParams.get('type');
    
    // Once loading is complete, check if a session exists.
    if (session) {
      // If this is an email confirmation (signup), show the success page
      if (type === 'signup' || type === 'email') {
        setVerifying(false);
        navigate('/auth/confirm?verified=true');
      } else {
        // For other auth types (password recovery, etc.), go to panel
        navigate('/panel');
      }
    } else {
      // If there's no session after the auth flow, something went wrong.
      // This could be due to an invalid link, an expired token, or other issues.
      // We notify the user and redirect them to the login page.
      toast({
        title: 'Fallo de Autenticación',
        description: 'No se pudo verificar tu sesión. Por favor, intenta iniciar sesión.',
        variant: 'destructive',
        duration: 8000,
      });
      navigate('/login?error=link');
    }
  }, [session, loading, navigate, toast, searchParams]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-neutral-50 text-center">
      <Loader2 className="h-16 w-16 animate-spin text-orange" />
      <h1 className="mt-6 text-2xl font-bold text-neutral-800">Verificando tu sesión...</h1>
      <p className="mt-2 text-neutral-600">Por favor, espera un momento.</p>
    </div>
  );
};

export default AuthCallbackPage;
