import React from "react";
import { SectionLabel } from "./Shared.jsx";

export default function InstagramSection() {
  return (
    <section style={{ background: "var(--bg-alt)", paddingBottom: 90 }}>
      <div className="wrap">
        <SectionLabel>@Toksntrays</SectionLabel>
        <h2 className="section-title serif">Follow The Kitchen</h2>
        <div className="insta-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              className="insta-tile"
              key={i}
              href="https://instagram.com/Toksntrays"
              target="_blank"
              rel="noreferrer"
            >
              <span style={{ fontSize: "1.2rem", opacity: 0.6 }}>◈</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
