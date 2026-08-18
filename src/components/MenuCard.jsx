import React, { useState } from "react";
import { FoodImage } from "./Shared.jsx";
import { naira, minPrice } from "../data/menuData.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

const CATEGORY_LABEL = { pizza: "Pizza", soup: "Soup Bowl", stew: "Stew" };

export default function MenuCard({ item }) {
  const [open, setOpen] = useState(false);
  const sizeEntries = Object.entries(item.sizes);
  const { addItem } = useCart();
  const { notify } = useUI();

  function handleAdd(size) {
    addItem(item, size, 1);
    notify(`${item.name} (${size}) added to cart`);
  }

  return (
    <div className="menu-card">
      <div className="menu-card-top" onClick={() => setOpen((o) => !o)}>
        <FoodImage src={item.img} alt={item.name} />
        <div className="menu-card-info">
          <div className="cat-pill">{CATEGORY_LABEL[item.category]}</div>
          <h3>{item.name}</h3>
          <p>{item.tag}</p>
          <div className="row">
            <div className="price">From {naira(minPrice(item.sizes))}</div>
            <span className={`expand-arrow ${open ? "open" : ""}`}>▾</span>
          </div>
        </div>
      </div>
      <div className={`menu-card-sizes ${open ? "open" : ""}`}>
        {sizeEntries.map(([size, price]) => (
          <div className="size-row" key={size}>
            <span className="size-label">{size}</span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span className="size-price">{naira(price)}</span>
              <button onClick={() => handleAdd(size)}>Add</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
