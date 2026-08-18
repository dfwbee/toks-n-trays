import React, { useState } from "react";

export function FoodImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={className}
        style={{
          background: "linear-gradient(135deg,#241d20,#3a2530)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "2.2rem", opacity: 0.5 }}>✦</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}

export function Leaf({ flip }) {
  return (
    <svg width="90" height="18" viewBox="0 0 90 18" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
      <path d="M0 9 H36" stroke="#b56f89" strokeWidth="1" />
      <path d="M40 9 C46 2, 56 2, 62 9 C56 16, 46 16, 40 9 Z" fill="none" stroke="#d99cb0" strokeWidth="1.1" />
      <path d="M66 9 H90" stroke="#b56f89" strokeWidth="1" />
    </svg>
  );
}

export function Monogram({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#d99cb0" strokeWidth="1.3" />
      <text x="50" y="61" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="40" fill="#f6f1ea">T</text>
      <text x="68" y="46" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fill="#d99cb0">N</text>
    </svg>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <Leaf />
      <span>{children}</span>
      <Leaf flip />
    </div>
  );
}
