import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

export type BetaUserRole = "ADMIN" | "TESTER" | "USER";
export type BetaUserStatus = "INVITED" | "ACTIVE" | "SUSPENDED";

export type BetaProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: BetaUserRole;
  status: BetaUserStatus;
  beta_terms_version: string | null;
  beta_terms_accepted_at: string | null;
  telemetry_consent: boolean;
  telemetry_consent_at: string | null;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  profile: BetaProfile | null;
  profileError: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<BetaProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id,email,display_name,role,status,beta_terms_version,beta_terms_accepted_at,telemetry_consent,telemetry_consent_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  let profile = data as BetaProfile;

  if (profile.status === "INVITED") {
    const { error: activationError } = await supabase.rpc("activate_current_tester");
    if (activationError) throw activationError;

    const { data: refreshed, error: refreshError } = await supabase
      .from("profiles")
      .select(
        "id,email,display_name,role,status,beta_terms_version,beta_terms_accepted_at,telemetry_consent,telemetry_consent_at"
      )
      .eq("id", userId)
      .single();

    if (refreshError) throw refreshError;
    profile = refreshed as BetaProfile;
  }

  return profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<BetaProfile | null>(null);
  const [profileError, setProfileError] = useState(false);

  const hydrateProfile = useCallback(async (nextSession: Session | null) => {
    setProfileError(false);

    if (!nextSession) {
      setProfile(null);
      return;
    }

    try {
      const nextProfile = await fetchProfile(nextSession.user.id);
      setProfile(nextProfile);
      setProfileError(!nextProfile);
    } catch (error) {
      console.error("Unable to load beta profile", error);
      setProfile(null);
      setProfileError(true);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let alive = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      await hydrateProfile(data.session);
      if (alive) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;
      setSession(nextSession);
      setLoading(true);
      void hydrateProfile(nextSession).finally(() => {
        if (alive) setLoading(false);
      });
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [hydrateProfile]);

  const sendOtp = useCallback(async (email: string) => {
    if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false
      }
    });

    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: "email"
    });

    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session) return;
    await hydrateProfile(session);
  }, [hydrateProfile, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      profile,
      profileError,
      sendOtp,
      verifyOtp,
      signOut,
      refreshProfile
    }),
    [loading, session, profile, profileError, sendOtp, verifyOtp, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
