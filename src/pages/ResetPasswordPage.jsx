import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const res = await updatePassword(password);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error || "That reset link may have expired. Please request a new one.");
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/account"), 2000);
  }

  return (
    <div className="auth-page">
      <div className="wrap auth-wrap">
        <h1 className="serif">Set New Password</h1>

        {done ? (
          <p className="muted-text">Password updated! Redirecting you to your account…</p>
        ) : (
          <form className="tnt-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            <label>
              New Password
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
              Confirm New Password
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            <button type="submit" className="cta-btn" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
