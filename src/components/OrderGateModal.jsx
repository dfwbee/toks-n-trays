import React from "react";
import { useNavigate } from "react-router-dom";

// Shown when a logged-out visitor clicks "Order Now" — lets them choose
// to sign in, create an account, or just continue straight to the menu as a guest.
export default function OrderGateModal({ onClose }) {
  const navigate = useNavigate();

  function go(path) {
    onClose();
    navigate(path, { state: { from: "/menu" } });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <div className="script" style={{ fontSize: "1.1rem" }}>Before You Order</div>
          <h3 className="serif">Sign In or Continue as Guest</h3>
          <p className="muted-text" style={{ marginBottom: 22 }}>
            Sign in to track your orders and check out faster, or continue without an account.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="cta-btn" onClick={() => go("/login")}>Sign In</button>
            <button className="cta-outline" onClick={() => go("/signup")}>Create an Account</button>
            <button
              onClick={() => go("/menu")}
              style={{ background: "none", border: "none", color: "var(--muted)", textDecoration: "underline", cursor: "pointer", padding: "8px 0", fontFamily: "'Jost', sans-serif" }}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}