import React, { useEffect, useState } from "react";
import { SectionLabel } from "./Shared.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

function Stars({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, fontSize: "1.4rem", cursor: onChange ? "pointer" : "default" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => onChange && onChange(n)}
          style={{ color: n <= value ? "var(--pink)" : "rgba(217,156,176,0.25)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { user } = useAuth();
  const { notify } = useUI();
  const [reviews, setReviews] = useState([]);
  const [tIndex, setTIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);
    setReviews(data || []);
  }

  useEffect(() => {
    if (reviews.length === 0) return;
    const id = setInterval(() => setTIndex((i) => (i + 1) % reviews.length), 5500);
    return () => clearInterval(id);
  }, [reviews]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!comment.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      name: user.name,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setComment("");
    setShowForm(false);
    notify("Thanks! Your review will appear once approved.");
  }

  return (
    <section>
      <div className="wrap">
        <SectionLabel>Kind Words</SectionLabel>
        <h2 className="section-title serif">What Our Customers Say</h2>

        {reviews.length > 0 ? (
          <div className="testi-wrap">
            <Stars value={reviews[tIndex].rating} />
            <p className="testi-quote">"{reviews[tIndex].comment}"</p>
            <div className="testi-name serif">{reviews[tIndex].name}</div>
            <div className="testi-dots">
              {reviews.map((_, i) => (
                <span key={i} className={i === tIndex ? "active" : ""} onClick={() => setTIndex(i)} />
              ))}
            </div>
          </div>
        ) : (
          <p className="muted-text" style={{ textAlign: "center" }}>Be the first to leave a review!</p>
        )}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          {user ? (
            showForm ? (
              <form className="tnt-form" onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
                {error && <div className="form-error">{error}</div>}
                <label>
                  Your rating
                  <Stars value={rating} onChange={setRating} />
                </label>
                <label>
                  Your review
                  <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} required />
                </label>
                <div className="admin-form-actions">
                  <button type="submit" className="cta-btn" disabled={submitting}>{submitting ? "Submitting…" : "Submit Review"}</button>
                  <button type="button" className="cta-outline" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button className="cta-outline" onClick={() => setShowForm(true)}>Leave a Review</button>
            )
          ) : (
            <p className="muted-text">Sign in to leave a review.</p>
          )}
        </div>
      </div>
    </section>
  );
}