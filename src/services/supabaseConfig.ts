export const defaultSupabaseUrl = 'https://adpvlipxeeyadeanzvuh.supabase.co';
export const defaultPublishableKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHZsaXB4ZWV5YWRlYW56dnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODQ0NjYsImV4cCI6MjA5MzQ2MDQ2Nn0._M1qFi0ETtWnhzml9A9z_8VtX30fHbRZ6_Xm-CuyXHQ';

export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  defaultSupabaseUrl;

export const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  defaultPublishableKey;

export const supabaseProjectRef = 'adpvlipxeeyadeanzvuh';
