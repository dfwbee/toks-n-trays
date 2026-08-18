import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { naira } from "../../data/menuData.js";
import { ORDER_STAGES } from "../../data/orders.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId);
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    setUpdatingId(null);
  }

  if (loading) return <p className="muted-text">Loading orders…</p>;
  if (orders.length === 0) return <p className="muted-text">No orders yet.</p>;

  return (
    <div className="admin-orders">
      {orders.map((o) => (
        <div className="admin-order-card" key={o.id}>
          <div className="admin-order-head">
            <strong>{o.id}</strong>
            <span className={`pay-badge ${o.payment_status}`}>{o.payment_status}</span>
          </div>
          <div className="muted-text">{o.customer_name} · {o.customer_phone}</div>
          <div className="muted-text">{o.delivery_address}</div>
          <div style={{ margin: "8px 0" }}>Total: <strong>{naira(o.total)}</strong></div>
          <label>
            Status:{" "}
            <select
              value={o.status}
              disabled={updatingId === o.id}
              onChange={(e) => updateStatus(o.id, e.target.value)}
            >
              {ORDER_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}
