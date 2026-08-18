import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await requestPasswordReset(email);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSent(true);
  }

  return (
    <div className="auth-page">
      <div className="wrap auth-wrap">
        <h1 className="serif">Reset Password</h1>

        {sent ? (
          <p className="muted-text">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            Check your inbox (and spam folder) and click the link to continue.
          </p>
        ) : (
          <form className="tnt-form" onSubmit={handleSubmit}>
            <p className="muted-text">Enter your email and we'll send you a link to reset your password.</p>
            {error && <div className="form-error">{error}</div>}
            <label>
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button type="submit" className="cta-btn" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
