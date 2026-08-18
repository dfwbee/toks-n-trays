import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    notify("Welcome back!");
    const from = location.state?.from || (res.user?.isAdmin ? "/admin" : "/account");
    navigate(from);
  }

  return (
    <div className="auth-page">
      <div className="wrap auth-wrap">
        <div className="script" style={{ fontSize: "1.2rem" }}>Welcome Back</div>
        <h1 className="serif">Sign In</h1>
        <form className="tnt-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <p style={{ textAlign: "right", margin: "-8px 0 4px" }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          <button type="submit" className="cta-btn" style={{ width: "100%" }}>Sign In</button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}