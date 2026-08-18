import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Monogram } from "./Shared.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import OrderGateModal from "./OrderGateModal.jsx";

export default function Navbar({ scrollTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOrderGate, setShowOrderGate] = useState(false);
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const go = (id) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  function handleOrderNow() {
    setMenuOpen(false);
    if (user) {
      navigate("/menu");
    } else {
      setShowOrderGate(true);
    }
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <Monogram size={40} />
          <div className="brand-name">
            TOKS 'N' TRAYS
            <small>HOMEMADE LUXURY</small>
          </div>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <button onClick={() => go("why")}>About</button>
          <button onClick={() => go("footer")}>Contact</button>
        </div>
        <div className="nav-right">
          <Link className="icon-btn" to={user ? "/account" : "/login"} aria-label="Account" style={{ textDecoration: "none" }}>☺</Link>
          <button className="icon-btn" onClick={openCart} aria-label="Cart">
            🛍<span className="cart-badge">{count}</span>
          </button>
          <button className="cta-btn" onClick={handleOrderNow}>Order Now</button>
          <button className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
        <button onClick={() => go("why")}>About</button>
        <button onClick={() => go("footer")}>Contact</button>
        <button onClick={() => { setMenuOpen(false); openCart(); }}>Cart ({count})</button>
        <Link to={user ? "/account" : "/login"} onClick={() => setMenuOpen(false)}>Account</Link>
      </div>
      {showOrderGate && <OrderGateModal onClose={() => setShowOrderGate(false)} />}
    </nav>
  );
}