import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase initialization warning:', err);
    supabase = null;
  }
}

export const getSupabaseConfig = () => {
  const savedUrl = localStorage.getItem('app_supabase_url') || SUPABASE_URL;
  const savedKey = localStorage.getItem('app_supabase_key') || SUPABASE_ANON_KEY;
  return {
    url: savedUrl,
    anonKey: savedKey,
    isConnected: !!(savedUrl && savedKey)
  };
};

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return config.isConnected;
};

export const initCustomSupabase = (url: string, key: string): SupabaseClient => {
  localStorage.setItem('app_supabase_url', url);
  localStorage.setItem('app_supabase_key', key);
  supabase = createClient(url, key);
  return supabase;
};
