import React from "react";
import { SectionLabel } from "./Shared.jsx";

const REASONS = [
  { icon: "✦", title: "Truly Homemade", body: "Every tray is prepared in small batches, never mass-produced." },
  { icon: "❦", title: "Premium Ingredients", body: "Quality proteins and fresh produce, sourced with care." },
  { icon: "◇", title: "Sealed & Fresh", body: "Packed in leak-proof trays that lock in flavour till it reaches you." },
  { icon: "♥", title: "Made With Love", body: "Recipes passed down and perfected — you can taste the difference." },
];

export default function WhyChooseUs() {
  return (
    <section id="why" style={{ background: "var(--bg-alt)" }}>
      <div className="wrap">
        <SectionLabel>The Toks 'N' Trays Promise</SectionLabel>
        <h2 className="section-title serif">Why Choose Us</h2>
        <div className="why-grid">
          {REASONS.map((w, i) => (
            <div className="why-card" key={i}>
              <div className="why-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
