import React, { useMemo, useState } from "react";
import MenuCard from "../components/MenuCard.jsx";
import { CATEGORIES } from "../data/menuData.js";
import { useMenu } from "../context/MenuContext.jsx";

export default function MenuPage() {
  const { items: ALL_ITEMS, loading } = useMenu();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category, ALL_ITEMS]);

  if (loading) {
    return <div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>Loading menu…</div>;
  }

  return (
    <>
      <div className="menu-hero">
        <div className="wrap">
          <div className="script" style={{ fontSize: "1.3rem" }}>Our Full Menu</div>
          <h1 className="serif">Pizza, Soups &amp; Stews</h1>
          <p>Search by name or filter by category to find exactly what you're craving today.</p>
        </div>
      </div>

      <div className="menu-controls">
        <div className="wrap menu-controls-inner">
          <div className="search-box">
            <span className="search-icon">⚲</span>
            <input
              type="text"
              placeholder="Search the menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`cat-tab ${category === c.key ? "active" : ""}`}
                onClick={() => setCategory(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="menu-results-count">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </div>

        {filtered.length === 0 ? (
          <div className="menu-empty">
            <span>✦</span>
            No items match your search — try a different keyword or category.
          </div>
        ) : (
          <div className="menu-grid" style={{ marginBottom: 90 }}>
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
