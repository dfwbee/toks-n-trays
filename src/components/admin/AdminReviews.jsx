import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }

  async function approve(id) {
    await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
    fetchReviews();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  }

  if (loading) return <p className="muted-text">Loading reviews…</p>;
  if (reviews.length === 0) return <p className="muted-text">No reviews yet.</p>;

  return (
    <div className="admin-menu-list">
      {reviews.map((r) => (
        <div className="admin-menu-row" key={r.id} style={{ alignItems: "flex-start" }}>
          <div>
            <strong>{r.name}</strong> — {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            <div className="muted-text" style={{ marginTop: 4 }}>{r.comment}</div>
            {!r.is_approved && <span className="pay-badge pending" style={{ marginTop: 6, display: "inline-block" }}>Pending approval</span>}
          </div>
          <div className="admin-form-actions">
            {!r.is_approved && <button className="cta-btn" onClick={() => approve(r.id)}>Approve</button>}
            <button className="cta-outline" onClick={() => handleDelete(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}