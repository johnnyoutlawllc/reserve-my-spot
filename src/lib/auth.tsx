'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/*
 * Real Supabase Auth, Google only, and deliberately separate from `session.tsx`.
 *
 * `session.tsx` answers "which seeded demo identity is this tab pretending to
 * be" and is what the member / front desk / admin surfaces run on. This answers
 * "who is the actual human looking at the marketing site": a spa owner kicking
 * the tires, or a member who wants their profile remembered. Keeping them apart
 * means signing in with Google does not hijack the three-lane demo, and the
 * demo stays open to the public with no sign-in at all.
 */

type Ctx = {
  user: User | null;
  /** True until the stored Supabase session has been read back. */
  loading: boolean;
  /** Google's given name if we got one, else the local part of the email. */
  displayName: string | null;
  avatarUrl: string | null;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

function nameOf(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const full =
    (typeof meta.given_name === 'string' && meta.given_name) ||
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    '';
  if (full) return full.split(/\s+/)[0];
  return user.email?.split('@')[0] ?? 'there';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (err) setError(err.message);
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error: err } = await supabase.auth.signOut();
    if (err) setError(err.message);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      user,
      loading,
      displayName: nameOf(user),
      avatarUrl:
        (typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null) ??
        null,
      error,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, error, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
