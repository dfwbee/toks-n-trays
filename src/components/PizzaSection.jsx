import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FoodImage, SectionLabel } from "./Shared.jsx";
import { naira } from "../data/menuData.js";
import { useMenu } from "../context/MenuContext.jsx";
import ProductModal from "./ProductModal.jsx";

export default function PizzaSection() {
  const { pizzas: PIZZAS, loading } = useMenu();
  const [active, setActive] = useState(null);

  if (loading) return null;

  return (
    <section id="pizza" style={{ background: "var(--bg-alt)" }}>
      <div className="wrap">
        <SectionLabel>Launch Prices</SectionLabel>
        <h2 className="section-title serif">Pizza, Our Way</h2>
        <p className="section-sub">
          Six signature blends, stone-baked and layered generously — because a pizza should feel like an occasion.
        </p>
        <div className="grid">
          {PIZZAS.map((p) => (
            <div className="food-card" key={p.id} onClick={() => setActive(p)}>
              <FoodImage src={p.img} alt={p.name} />
              <div className="food-card-body">
                <h3>{p.name}</h3>
                <p>{p.tag}</p>
                <div className="food-card-foot">
                  <div className="price">
                    {naira(p.sizes.Medium)}
                    <br />
                    <small>Medium · X-Large {naira(p.sizes["X-Large"])}</small>
                  </div>
                  <button className="add-mini" onClick={(e) => { e.stopPropagation(); setActive(p); }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more-wrap">
          <Link to="/menu" className="cta-outline" style={{ textDecoration: "none", display: "inline-block" }}>View Full Menu</Link>
        </div>
      </div>
      {active && <ProductModal item={active} onClose={() => setActive(null)} />}
    </section>
  );
}
