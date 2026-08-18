import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Turn a Supabase session + profile row into the simple shape your pages expect
  async function buildUserFromSession(session) {
    if (!session?.user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, phone, is_admin")
      .eq("id", session.user.id)
      .single();
    return {
      id: session.user.id,
      email: session.user.email,
      name: profile?.name || "",
      phone: profile?.phone || "",
      isAdmin: profile?.is_admin || false,
    };
  }

  useEffect(() => {
    // Check if there's already a logged-in session (e.g. page refresh)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(await buildUserFromSession(session));
      setLoading(false);
    });

    // Keep user state in sync if they log in/out in another tab
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(await buildUserFromSession(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signup({ name, email, phone, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }, // picked up by the trigger to fill profiles table
    });
    if (error) return { ok: false, error: error.message };
    setUser({ id: data.user.id, email, name, phone });
    return { ok: true };
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: friendlyAuthError(error) };
    const builtUser = await buildUserFromSession(data.session);
    setUser(builtUser);
    return { ok: true, user: builtUser };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, requestPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Turns Supabase's raw error messages into something a customer can act on.
function friendlyAuthError(error) {
  const msg = error.message || "";
  if (msg.toLowerCase().includes("email not confirmed")) {
    return "Please confirm your email first — check your inbox for the verification link.";
  }
  if (msg.toLowerCase().includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }
  return msg || "Something went wrong signing in. Please try again.";
}