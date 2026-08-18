import React, { useState } from "react";
import { FoodImage, SectionLabel } from "./Shared.jsx";
import { naira, minPrice } from "../data/menuData.js";
import { useMenu } from "../context/MenuContext.jsx";
import ProductModal from "./ProductModal.jsx";

export default function FeaturedMeals() {
  const { pizzas, soups, stews, loading } = useMenu();
  const [active, setActive] = useState(null);

  if (loading) return null;
  const items = [pizzas[0], pizzas[1], soups[0], stews[0], pizzas[4], soups[7]].filter(Boolean);

  return (
    <section>
      <div className="wrap">
        <SectionLabel>Customer Favourites</SectionLabel>
        <h2 className="section-title serif">Featured Meals</h2>
        <p className="section-sub">
          A first taste of what leaves our kitchen every day — chosen by the people who order them again and again.
        </p>
        <div className="grid">
          {items.map((item) => (
            <div className="food-card" key={item.id} onClick={() => setActive(item)}>
              <FoodImage src={item.img} alt={item.name} />
              <div className="food-card-body">
                <h3>{item.name}</h3>
                <p>{item.tag}</p>
                <div className="food-card-foot">
                  <div className="price">
                    From {naira(minPrice(item.sizes))}
                    <br />
                    <small>{Object.keys(item.sizes).length} sizes available</small>
                  </div>
                  <button className="add-mini" onClick={(e) => { e.stopPropagation(); setActive(item); }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {active && <ProductModal item={active} onClose={() => setActive(null)} />}
    </section>
  );
}
