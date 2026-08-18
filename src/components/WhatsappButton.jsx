import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { naira } from "../data/menuData.js";

const WHATSAPP_NUMBER = "2348025529215"; // WA 0802 552 9215, in international format

export default function WhatsAppButton() {
  const { items, subtotal } = useCart();

  function handleClick() {
    let message;
    if (items.length > 0) {
      const lines = items.map((i) => `• ${i.qty}x ${i.name} (${i.size}) — ${naira(i.price * i.qty)}`);
      message = `Hi! I'd like to order:\n\n${lines.join("\n")}\n\nSubtotal: ${naira(subtotal)}`;
    } else {
      message = "Hi! I'd like to place an order with Toks 'N' Trays.";
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <button className="whatsapp-fab" onClick={handleClick} aria-label="Order via WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.44.79 3.07 1.2 4.74 1.2 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.77-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.07.17-.2.71-.83.9-1.11.19-.29.38-.24.63-.14.25.1 1.6.75 1.87.89.27.14.45.2.52.32.07.12.07.68-.17 1.36z" />
      </svg>
    </button>
  );
}