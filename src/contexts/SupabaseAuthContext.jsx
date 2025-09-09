
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
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, metadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: "https://traductorburocratico.es/auth/callback",
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
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
    }

    return { error };
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
    updateUserPassword,
  }), [user, session, loading, isAdmin, signUp, signIn, signOut, updateUserPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
