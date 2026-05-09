import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { secureAuthStorage } from './secureAuthStorage';
import { supabaseProjectRef, supabasePublishableKey, supabaseUrl } from './supabaseConfig';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
    storage: secureAuthStorage,
    storageKey: `sb-${supabaseProjectRef}-auth-token`
  }
});
