import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("id, name, phone, is_admin, created_at").order("created_at", { ascending: false });
      setCustomers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="muted-text">Loading customers…</p>;
  if (customers.length === 0) return <p className="muted-text">No customers yet.</p>;

  return (
    <div className="admin-customers-list">
      {customers.map((c) => (
        <div className="admin-customer-row" key={c.id}>
          <strong>{c.name || "(no name)"}</strong>
          <span className="muted-text">{c.phone}</span>
          {c.is_admin && <span className="pay-badge paid">admin</span>}
        </div>
      ))}
    </div>
  );
}
