import type { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { clearGuestProgress, readGuestProgress } from '../services/guestProgress';
import { supabase } from '../services/supabaseClient';

type AuthContextValue = {
  initializing: boolean;
  session: Session | null;
  user: User | null;
  syncVersion: number;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  syncGuestProgress: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [lastSyncedUserId, setLastSyncedUserId] = useState<string | null>(null);
  const [syncVersion, setSyncVersion] = useState(0);

  const syncGuestProgress = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const activeUser = data.session?.user;
    if (!activeUser) return;

    const guest = await readGuestProgress();
    if (guest.xp <= 0 && guest.completedCases.length === 0) return;

    const { error } = await supabase.rpc('merge_guest_progress', {
      _xp: guest.xp,
      _cases: guest.completedCases
    });

    if (error) throw error;

    await clearGuestProgress();
    setLastSyncedUserId(activeUser.id);
    setSyncVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setSession(data.session);
      })
      .finally(() => {
        if (mounted) setInitializing(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitializing(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId || userId === lastSyncedUserId) return;

    syncGuestProgress().catch((error) => {
      console.warn('[Auth] Failed to sync guest progress:', error);
    });
  }, [lastSyncedUserId, session?.user.id, syncGuestProgress]);

  useEffect(() => {
    if (AppState.currentState === 'active') {
      supabase.auth.startAutoRefresh();
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName?.trim() || email.trim().split('@')[0]
          }
        }
      });

      if (error) throw error;

      return {
        needsEmailConfirmation: !data.session
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      session,
      user: session?.user ?? null,
      syncVersion,
      signIn,
      signUp,
      signOut,
      syncGuestProgress
    }),
    [initializing, session, signIn, signOut, signUp, syncGuestProgress, syncVersion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
