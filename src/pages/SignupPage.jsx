import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function SignupPage() {
  const { signup } = useAuth();
  const { notify } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    const res = await signup(form);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    notify("Account created — welcome to Toks 'N' Trays!");
    navigate(location.state?.from || "/account");
  }

  return (
    <div className="auth-page">
      <div className="wrap auth-wrap">
        <div className="script" style={{ fontSize: "1.2rem" }}>Join Us</div>
        <h1 className="serif">Create Account</h1>
        <form className="tnt-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          <label>
            Full Name
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>
          <label>
            Phone
            <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} />
          </label>
          <button type="submit" className="cta-btn" style={{ width: "100%" }}>Create Account</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}