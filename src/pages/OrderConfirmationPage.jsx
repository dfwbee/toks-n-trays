import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, stageLabel } from "../data/orders.js";
import { naira } from "../data/menuData.js";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrder(orderId).then((o) => {
      if (!cancelled) {
        setOrder(o);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="wrap auth-wrap" style={{ textAlign: "center" }}>Loading your order…</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="wrap auth-wrap">
          <h1 className="serif">Order Not Found</h1>
          <p className="muted-text">We couldn't find an order with that ID.</p>
          <Link to="/menu" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }}>Back to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="wrap auth-wrap" style={{ textAlign: "center" }}>
        <div className="script" style={{ fontSize: "1.3rem" }}>Thank You</div>
        <h1 className="serif">Order Confirmed</h1>
        <p className="muted-text">
          Your order <strong>{order.id}</strong> has been received and is currently <strong>{stageLabel(order)}</strong>.
        </p>

        <div className="checkout-summary" style={{ textAlign: "left", marginTop: 30 }}>
          <h3 className="serif">Order Summary</h3>
          {order.items.map((i) => (
            <div className="summary-row" key={`${i.id}-${i.size}`}>
              <span>{i.qty} × {i.name} ({i.size})</span>
              <span>{naira(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{naira(order.deliveryFee)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{naira(order.total)}</span>
          </div>
          <p className="muted-text" style={{ marginTop: 16 }}>Delivering to: {order.customer.address}</p>
        </div>

        <div className="hero-actions" style={{ justifyContent: "center", marginTop: 30 }}>
          <Link to={`/track/${order.id}`} className="cta-btn" style={{ textDecoration: "none" }}>Track Order</Link>
          <Link to="/menu" className="cta-outline" style={{ textDecoration: "none" }}>Order More</Link>
        </div>
      </div>
    </div>
  );
}
