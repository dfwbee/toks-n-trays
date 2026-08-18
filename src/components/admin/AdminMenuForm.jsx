import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { naira } from "../../data/menuData.js";
import AdminMenuItemForm from "./AdminMenuItemForm.jsx";

export default function AdminMenuForm() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = not editing, {} = adding new
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").order("category").order("name");
    setItems(data || []);
    setLoading(false);
  }

  async function handleSave(itemData) {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("menu_items").upsert(itemData);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditingItem(null);
    fetchItems();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this item from the menu?")) return;
    await supabase.from("menu_items").update({ is_available: false }).eq("id", id);
    fetchItems();
  }

  if (loading) return <p className="muted-text">Loading menu…</p>;

  if (editingItem !== null) {
    return (
      <div>
        <h3 className="serif">{editingItem.id ? "Edit Item" : "New Item"}</h3>
        {error && <div className="form-error">{error}</div>}
        <AdminMenuItemForm
          item={editingItem.id ? editingItem : null}
          existingCategories={Array.from(new Set(items.map((i) => i.category)))}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <button className="cta-btn" onClick={() => setEditingItem({})} style={{ marginBottom: 16 }}>
        + Add New Item
      </button>
      <div className="admin-menu-list">
        {items.map((item) => (
          <div className="admin-menu-row" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <div className="muted-text">{item.category} · {Object.entries(item.sizes).map(([s, p]) => `${s}: ${naira(p)}`).join(", ")}</div>
            </div>
            <div className="admin-form-actions">
              <button className="cta-outline" onClick={() => setEditingItem(item)}>Edit</button>
              <button className="cta-outline" onClick={() => handleDelete(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}