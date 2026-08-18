import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { naira } from "../data/menuData.js";

export default function DeliveryAreaChecker() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null); // null = no search yet

  useEffect(() => {
    supabase
      .from("delivery_areas")
      .select("*")
      .eq("is_active", true)
      .order("area_name")
      .then(({ data }) => {
        setAreas(data || []);
        setLoading(false);
      });
  }, []);

  function handleCheck(e) {
    e.preventDefault();
    const match = areas.find((a) => a.area_name.toLowerCase().includes(query.trim().toLowerCase()));
    setResult(match || false); // false = searched but not found
  }

  return (
    <div className="account-card">
      <h4>Delivery Area Checker</h4>
      <p className="muted-text">Delivering from Ibadan — check if we reach your area.</p>
      <form onSubmit={handleCheck} style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          placeholder="Enter your area, e.g. Bodija"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setResult(null); }}
          style={{ flex: 1 }}
        />
        <button className="cta-btn" type="submit" disabled={loading || !query.trim()}>Check</button>
      </form>

      {result === false && (
        <div className="form-error" style={{ marginTop: 14 }}>
          We don't currently deliver to "{query}". Contact us to confirm — we may still be able to help.
        </div>
      )}
      {result && (
        <div style={{ marginTop: 14, padding: "14px 16px", background: "var(--bg)", border: "1px solid rgba(217,156,176,0.2)", borderRadius: 8 }}>
          ✓ We deliver to <strong>{result.area_name}</strong> — delivery fee: <strong>{naira(result.fee)}</strong>
        </div>
      )}
    </div>
  );
}