// src/lib/customSupabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const functionsBaseUrl = (() => {
  if (!supabaseUrl) return null;
  try {
    const url = new URL(supabaseUrl);
    const host = url.host.includes('.supabase.co')
      ? url.host.replace('.supabase.co', '.functions.supabase.co')
      : `functions.${url.host}`;
    return `${url.protocol}//${host}`;
  } catch (error) {
    console.error('Failed to derive Supabase functions URL:', error);
    return null;
  }
})();

export const getSupabaseFunctionUrl = (path = '') => {
  if (!functionsBaseUrl) {
    throw new Error('Supabase URL is not configured for functions.');
  }
  const normalizedPath = path.replace(/^\/+/, '');
  return `${functionsBaseUrl}/${normalizedPath}`;
};
