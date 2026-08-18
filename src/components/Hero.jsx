import React from "react";
import { Link } from "react-router-dom";

export default function Hero({ scrollTo }) {
  return (
    <div id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-fade" />
      <div className="hero-content">
        <div className="hero-frame">
          <div className="hero-script script">Homemade Luxury</div>
          <h1 className="hero-title serif">
            Made With Love,<br />Served On A Tray.
          </h1>
          <p className="hero-sub">
            Hand-crafted pizzas, slow-simmered soups and rich Nigerian stews — prepared
            fresh to order and delivered to your door, from our kitchen to your table.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }}>Order Now</Link>
            <Link to="/menu" className="cta-outline" style={{ textDecoration: "none", display: "inline-block" }}>View Menu</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
