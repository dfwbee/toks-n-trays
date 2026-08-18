import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder, currentStage, ORDER_STAGES } from "../data/orders.js";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(orderId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setNotFound(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getOrder(orderId).then((o) => {
      if (cancelled) return;
      setOrder(o);
      setNotFound(!o);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [orderId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) navigate(`/track/${input.trim().toUpperCase()}`);
  }

  const stage = order ? currentStage(order) : -1;

  return (
    <div className="checkout-page">
      <div className="wrap auth-wrap">
        <div className="script" style={{ fontSize: "1.2rem" }}>Track Your Order</div>
        <h1 className="serif">Order Status</h1>

        <form className="tnt-form" onSubmit={handleSubmit} style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
          <label style={{ flex: 1 }}>
            Order ID
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. TNT-AB12CD" />
          </label>
          <button type="submit" className="cta-btn">Track</button>
        </form>

        {loading && <div className="muted-text" style={{ marginTop: 20 }}>Looking up your order…</div>}

        {!loading && orderId && notFound && (
          <div className="form-error" style={{ marginTop: 20 }}>No order found with ID "{orderId}".</div>
        )}

        {!loading && order && (
          <div className="track-timeline">
            {ORDER_STAGES.map((s, i) => (
              <div className={`track-step ${i <= stage ? "done" : ""}`} key={s}>
                <div className="track-dot" />
                <div>
                  <div className="track-label">{s}</div>
                  {i === stage && <div className="muted-text">Current status</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
