import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AddressesCard() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    setLoading(true);
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses(data || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!label.trim() || !text.trim()) return;

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: label.trim(),
      address_text: text.trim(),
      is_default: addresses.length === 0, // first address becomes default automatically
    });
    if (error) {
      setError(error.message);
      return;
    }
    setLabel("");
    setText("");
    setAdding(false);
    fetchAddresses();
  }

  async function handleDelete(id) {
    await supabase.from("addresses").delete().eq("id", id);
    fetchAddresses();
  }

  async function handleSetDefault(id) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    fetchAddresses();
  }

  if (loading) return <p className="muted-text">Loading addresses…</p>;

  return (
    <div className="account-card">
      <h4>Saved Addresses</h4>

      {addresses.length === 0 && !adding && (
        <p className="muted-text">No saved addresses yet.</p>
      )}

      <div className="address-list">
        {addresses.map((a) => (
          <div className="address-row" key={a.id}>
            <div>
              <div className="address-label">
                {a.label}
                {a.is_default && <span className="pay-badge paid" style={{ marginLeft: 8 }}>Default</span>}
              </div>
              <div className="muted-text">{a.address_text}</div>
            </div>
            <div className="admin-form-actions">
              {!a.is_default && (
                <button className="cta-outline" onClick={() => handleSetDefault(a.id)}>Set Default</button>
              )}
              <button className="cta-outline" onClick={() => handleDelete(a.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <form className="tnt-form" onSubmit={handleAdd} style={{ marginTop: 14 }}>
          {error && <div className="form-error">{error}</div>}
          <label>
            Label
            <input placeholder="e.g. Home, Office" value={label} onChange={(e) => setLabel(e.target.value)} required />
          </label>
          <label>
            Address
            <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} required />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="cta-btn">Save Address</button>
            <button type="button" className="cta-outline" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="cta-outline" style={{ marginTop: 12 }} onClick={() => setAdding(true)}>+ Add Address</button>
      )}
    </div>
  );
}