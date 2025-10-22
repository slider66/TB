
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = useCallback(async (user) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('global_role')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setIsAdmin(data.global_role === 'admin');
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    await checkAdminRole(currentUser);
    setLoading(false);
  }, [checkAdminRole]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);

        if (event === 'PASSWORD_RECOVERY' && typeof window !== 'undefined') {
          // Supabase sends users back to the root after verifying the recovery link.
          // Redirect them to the dedicated password update form.
          window.location.replace('/update-password');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
      return { data: null, error };
    }

    return { data, error: null };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast({
          variant: "destructive",
          title: "Error de autenticación",
          description: "Usuario o contraseña no encontrados.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error al iniciar sesión",
          description: error.message || "Ocurrió un error inesperado.",
        });
      }
      return { data: null, error };
    }

    return { data, error: null };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    setIsAdmin(false); // Reset admin state on logout
    return { error };
  }, [toast]);
  
  const passwordResetRedirectUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL;
    if (envUrl) {
      return envUrl;
    }

    if (typeof window !== 'undefined') {
      return `${window.location.origin}/update-password`;
    }

    return undefined;
  }, []);

  const sendPasswordResetEmail = useCallback(async (email) => {
    const options = passwordResetRedirectUrl
      ? { redirectTo: passwordResetRedirectUrl }
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, options);

    if (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo.",
      });
    } else {
        toast({
            title: "Correo enviado",
            description: "Si existe una cuenta con este email, recibirás un mensaje para restablecer tu contraseña.",
            className: "bg-green-500 text-white",
        });
    }
    return { error };
  }, [toast, passwordResetRedirectUrl]);

  const updateUserPassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  }, []);


  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updateUserPassword,
  }), [user, session, loading, isAdmin, signUp, signIn, signOut, sendPasswordResetEmail, updateUserPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
