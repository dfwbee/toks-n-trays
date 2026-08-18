import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  async function fetchCodes() {
    setLoading(true);
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setCodes(data || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!code.trim() || !value) return;
    setSaving(true);
    await supabase.from("promo_codes").insert({
      code: code.trim().toUpperCase(),
      discount_type: type,
      discount_value: Number(value),
    });
    setCode("");
    setValue("");
    setSaving(false);
    fetchCodes();
  }

  async function toggleActive(id, current) {
    await supabase.from("promo_codes").update({ is_active: !current }).eq("id", id);
    fetchCodes();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this promo code?")) return;
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchCodes();
  }

  if (loading) return <p className="muted-text">Loading promo codes…</p>;

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1, minWidth: 140 }}>
          <option value="percent">Percent off (%)</option>
          <option value="fixed">Fixed amount off (₦)</option>
        </select>
        <input type="number" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
        <button className="cta-btn" type="submit" disabled={saving}>{saving ? "Adding…" : "+ Add Code"}</button>
      </form>

      <div className="admin-menu-list">
        {codes.map((c) => (
          <div className="admin-menu-row" key={c.id}>
            <div>
              <strong>{c.code}</strong>
              <div className="muted-text">
                {c.discount_type === "percent" ? `${c.discount_value}% off` : `₦${c.discount_value} off`}
                {!c.is_active && " — inactive"}
              </div>
            </div>
            <div className="admin-form-actions">
              <button className="cta-outline" onClick={() => toggleActive(c.id, c.is_active)}>
                {c.is_active ? "Deactivate" : "Activate"}
              </button>
              <button className="cta-outline" onClick={() => handleDelete(c.id)}>Remove</button>
            </div>
          </div>
        ))}
        {codes.length === 0 && <p className="muted-text">No promo codes yet.</p>}
      </div>
    </div>
  );
}