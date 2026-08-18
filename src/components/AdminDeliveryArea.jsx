import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { naira } from "../../data/menuData.js";

export default function AdminDeliveryAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    setLoading(true);
    const { data } = await supabase.from("delivery_areas").select("*").order("area_name");
    setAreas(data || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !fee) return;
    setSaving(true);
    await supabase.from("delivery_areas").insert({ area_name: name.trim(), fee: Number(fee) });
    setName("");
    setFee("");
    setSaving(false);
    fetchAreas();
  }

  async function toggleActive(id, current) {
    await supabase.from("delivery_areas").update({ is_active: !current }).eq("id", id);
    fetchAreas();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this delivery area?")) return;
    await supabase.from("delivery_areas").delete().eq("id", id);
    fetchAreas();
  }

  if (loading) return <p className="muted-text">Loading delivery areas…</p>;

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input placeholder="Area name, e.g. Bodija" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 2, minWidth: 180 }} />
        <input type="number" placeholder="Fee (₦)" value={fee} onChange={(e) => setFee(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
        <button className="cta-btn" type="submit" disabled={saving}>{saving ? "Adding…" : "+ Add Area"}</button>
      </form>

      <div className="admin-menu-list">
        {areas.map((a) => (
          <div className="admin-menu-row" key={a.id}>
            <div>
              <strong>{a.area_name}</strong>
              <div className="muted-text">{naira(a.fee)} {!a.is_active && "— inactive"}</div>
            </div>
            <div className="admin-form-actions">
              <button className="cta-outline" onClick={() => toggleActive(a.id, a.is_active)}>
                {a.is_active ? "Deactivate" : "Activate"}
              </button>
              <button className="cta-outline" onClick={() => handleDelete(a.id)}>Remove</button>
            </div>
          </div>
        ))}
        {areas.length === 0 && <p className="muted-text">No delivery areas added yet.</p>}
      </div>
    </div>
  );
}