import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "tnt_cart";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, size, qty = 1) {
    const price = product.sizes[size];
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === size);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id: product.id, name: product.name, size, price, img: product.img, qty }];
    });
    setIsOpen(true);
  }

  function removeItem(id, size) {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }

  function updateQty(id, size, qty) {
    if (qty < 1) return removeItem(id, size);
    setItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i)));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        count,
        subtotal,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
