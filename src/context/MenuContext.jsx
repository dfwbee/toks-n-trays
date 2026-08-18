import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("id");

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setItems(data);
      }
      setLoading(false);
    }

    fetchMenu();
    return () => { cancelled = true; };
  }, []);

  const pizzas = items.filter((i) => i.category === "pizza");
  const soups = items.filter((i) => i.category === "soup");
  const stews = items.filter((i) => i.category === "stew");

  return (
    <MenuContext.Provider value={{ items, pizzas, soups, stews, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
