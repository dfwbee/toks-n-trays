import React from "react";
import { Link } from "react-router-dom";
import { FoodImage, SectionLabel } from "./Shared.jsx";
import { useMenu } from "../context/MenuContext.jsx";

export default function SoupStewPreview() {
  const { soups: SOUPS, stews: STEWS, loading } = useMenu();
  if (loading || SOUPS.length === 0 || STEWS.length === 0) return null;

  return (
    <section>
      <div className="wrap">
        <SectionLabel>From The Pot</SectionLabel>
        <h2 className="section-title serif">Soups &amp; Stew Collection</h2>
        <p className="section-sub">
          Traditional recipes, simmered low and slow — packed fresh in sealed trays, ready to reheat and enjoy.
        </p>
        <div className="split">
          <Link to="/menu" className="split-card" style={{ textDecoration: "none" }}>
            <FoodImage src={SOUPS[0].img} alt="Soup Bowls" />
            <div className="split-overlay">
              <p>{SOUPS.length} Varieties</p>
              <h3 className="serif">Soup Bowls</h3>
              <span className="cta-btn">Explore Soups</span>
            </div>
          </Link>
          <Link to="/menu" className="split-card" style={{ textDecoration: "none" }}>
            <FoodImage src={STEWS[0].img} alt="Stew Collection" />
            <div className="split-overlay">
              <p>{STEWS.length} Varieties</p>
              <h3 className="serif">Stew Collection</h3>
              <span className="cta-btn">Explore Stews</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
