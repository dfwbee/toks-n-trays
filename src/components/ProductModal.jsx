import React, { useState } from "react";
import { FoodImage } from "./Shared.jsx";
import { naira } from "../data/menuData.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function ProductModal({ item, onClose }) {
  const sizeEntries = Object.entries(item.sizes);
  const [size, setSize] = useState(sizeEntries[0][0]);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { notify } = useUI();

  function handleAdd() {
    addItem(item, size, qty);
    notify(`${item.name} (${size}) added to cart`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <FoodImage src={item.img} alt={item.name} className="modal-img" />
        <div className="modal-body">
          <h3 className="serif">{item.name}</h3>
          <p className="modal-tag">{item.tag}</p>

          <div className="modal-sizes">
            {sizeEntries.map(([s, price]) => (
              <button
                key={s}
                className={`size-pick ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                <span>{s}</span>
                <span>{naira(price)}</span>
              </button>
            ))}
          </div>

          <div className="modal-qty">
            <span>Quantity</span>
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <button className="cta-btn modal-add" onClick={handleAdd}>
            Add {naira(item.sizes[size] * qty)} to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
