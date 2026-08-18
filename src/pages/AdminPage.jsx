import React, { useState } from "react";
import AdminStats from "../components/admin/AdminStats.jsx";
import AdminOrders from "../components/admin/AdminOrders.jsx";
import AdminMenuForm from "../components/admin/AdminMenuForm.jsx";
import AdminCustomers from "../components/admin/AdminCustomers.jsx";

const TABS = [
  { key: "stats", label: "Overview", Component: AdminStats },
  { key: "orders", label: "Orders", Component: AdminOrders },
  { key: "menu", label: "Menu", Component: AdminMenuForm },
  { key: "customers", label: "Customers", Component: AdminCustomers },
];

export default function AdminPage() {
  const [tab, setTab] = useState("stats");
  const Active = TABS.find((t) => t.key === tab).Component;

  return (
    <div className="admin-page">
      <div className="wrap">
        <h1 className="serif">Admin Dashboard</h1>
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="admin-tab-content">
          <Active />
        </div>
      </div>
    </div>
  );
}
