import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type SupabaseContextValue = {
  client: SupabaseClient | null;
  isConfigured: boolean;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<SupabaseContextValue>(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      console.warn(
        '[SupabaseProvider] Variables VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY no configuradas. Funciones dependientes de Supabase quedan deshabilitadas.',
      );
      return {
        client: null,
        isConfigured: false,
      };
    }

    const client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'traductor-burocratico-web',
        },
      },
    });

    return {
      client,
      isConfigured: true,
    };
  }, []);

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = (): SupabaseContextValue => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe utilizarse dentro de un <SupabaseProvider>.');
  }
  return context;
};



