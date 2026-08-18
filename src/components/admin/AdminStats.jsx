import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { naira } from "../../data/menuData.js";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: orders } = await supabase.from("orders").select("total, status, payment_status");
      if (!orders) return;
      const paid = orders.filter((o) => o.payment_status === "paid");
      setStats({
        totalOrders: orders.length,
        pending: orders.filter((o) => o.status !== "Delivered").length,
        revenue: paid.reduce((sum, o) => sum + o.total, 0),
      });
    }
    load();
  }, []);

  if (!stats) return <p className="muted-text">Loading stats…</p>;

  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <div className="admin-stat-value">{stats.totalOrders}</div>
        <div className="muted-text">Total Orders</div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-value">{stats.pending}</div>
        <div className="muted-text">Orders In Progress</div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-value">{naira(stats.revenue)}</div>
        <div className="muted-text">Revenue (Paid Orders)</div>
      </div>
    </div>
  );
}
