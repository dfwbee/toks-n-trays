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
      .select("name, phone, is_admin, avatar_url")
      .eq("id", session.user.id)
      .single();
    return {
      id: session.user.id,
      email: session.user.email,
      name: profile?.name || "",
      phone: profile?.phone || "",
      isAdmin: profile?.is_admin || false,
      avatarUrl: profile?.avatar_url || "",
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

  async function updateAvatar(file) {
    if (!user) return { ok: false, error: "Not logged in." };

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) return { ok: false, error: uploadError.message };

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`; // cache-bust so the new photo shows immediately

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    if (dbError) return { ok: false, error: dbError.message };

    setUser((u) => ({ ...u, avatarUrl: url }));
    return { ok: true, url };
  }

  async function updateProfile({ name, phone }) {
    if (!user) return { ok: false, error: "Not logged in." };
    const { error } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("id", user.id);
    if (error) return { ok: false, error: error.message };
    setUser((u) => ({ ...u, name, phone }));
    return { ok: true };
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, requestPasswordReset, updatePassword, updateAvatar, updateProfile }}>
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