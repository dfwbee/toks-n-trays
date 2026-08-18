import React from "react";
import { useNavigate } from "react-router-dom";
import { FoodImage } from "./Shared.jsx";
import { naira } from "../data/menuData.js";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  function goCheckout() {
    closeCart();
    navigate("/checkout");
  }

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3 className="serif">Your Cart</h3>
          <button className="modal-close" onClick={closeCart} aria-label="Close">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span>✦</span>
            Your cart is empty. Browse the menu to add something delicious.
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((i) => (
                <div className="drawer-item" key={`${i.id}-${i.size}`}>
                  <FoodImage src={i.img} alt={i.name} className="drawer-item-img" />
                  <div className="drawer-item-info">
                    <div className="drawer-item-name">{i.name}</div>
                    <div className="drawer-item-size">{i.size}</div>
                    <div className="qty-stepper small">
                      <button onClick={() => updateQty(i.id, i.size, i.qty - 1)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => updateQty(i.id, i.size, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="drawer-item-right">
                    <div className="price">{naira(i.price * i.qty)}</div>
                    <button className="drawer-remove" onClick={() => removeItem(i.id, i.size)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="drawer-subtotal">
                <span>Subtotal</span>
                <span>{naira(subtotal)}</span>
              </div>
              <p className="drawer-note">Delivery fee is calculated at checkout.</p>
              <button className="cta-btn" style={{ width: "100%" }} onClick={goCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
