import React from "react";
import { Link } from "react-router-dom";
import { Monogram } from "./Shared.jsx";

export default function Footer({ scrollTo }) {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Monogram size={44} />
            <h3>TOKS 'N' TRAYS</h3>
            <div className="tag">Homemade Luxury. Made With Love.</div>
            <p>
              Hand-crafted Nigerian soups, stews and stone-baked pizza,
              <br />prepared fresh and delivered with care.
            </p>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            <Link to="/menu">Menu</Link>
            <Link to="/menu">Order</Link>
            <button onClick={() => scrollTo("footer")}>Contact</button>
          </div>
          <div className="foot-col">
            <h5>Information</h5>
            <Link to="/delivery-information">Delivery Information</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a href="tel:08025529215">WA 0802 552 9215</a>
            <a href="https://instagram.com/Toksntrays" target="_blank" rel="noreferrer">IG @Toksntrays</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Toks 'N' Trays. All rights reserved.</span>
          <span>Crafted with care · Served with love</span>
        </div>
      </div>
    </footer>
  );
}
