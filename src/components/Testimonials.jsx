import React, { useEffect, useState } from "react";
import { SectionLabel } from "./Shared.jsx";
import { TESTIMONIALS } from "../data/menuData.js";

export default function Testimonials() {
  const [tIndex, setTIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTIndex((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      <div className="wrap">
        <SectionLabel>Kind Words</SectionLabel>
        <h2 className="section-title serif">What Our Customers Say</h2>
        <div className="testi-wrap">
          <p className="testi-quote">"{TESTIMONIALS[tIndex].quote}"</p>
          <div className="testi-name serif">{TESTIMONIALS[tIndex].name}</div>
          <div className="testi-city">{TESTIMONIALS[tIndex].city}</div>
          <div className="testi-dots">
            {TESTIMONIALS.map((_, i) => (
              <span key={i} className={i === tIndex ? "active" : ""} onClick={() => setTIndex(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
