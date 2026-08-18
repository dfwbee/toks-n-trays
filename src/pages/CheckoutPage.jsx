import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { naira } from "../data/menuData.js";
import { saveOrder, makeOrderId } from "../data/orders.js";
import { payWithPaystack } from "../lib/paystack.js";

const DELIVERY_FEE = 3000;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null); // { code, discount_type, discount_value }
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    notes: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="wrap auth-wrap">
          <h1 className="serif">Your cart is empty</h1>
          <p className="muted-text">Add something from the menu before checking out.</p>
          <Link to="/menu" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }}>Browse Menu</Link>
        </div>
      </div>
    );
  }

  const preDiscountTotal = subtotal + DELIVERY_FEE;
  const discountAmount = promo
    ? promo.discount_type === "percent"
      ? Math.round(subtotal * (promo.discount_value / 100))
      : Math.min(promo.discount_value, preDiscountTotal)
    : 0;
  const total = preDiscountTotal - discountAmount;

  async function handleApplyPromo(e) {
    e.preventDefault();
    setPromoError("");
    if (!promoInput.trim()) return;

    setCheckingPromo(true);
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .ilike("code", promoInput.trim())
      .eq("is_active", true)
      .maybeSingle();
    setCheckingPromo(false);

    if (error || !data) {
      setPromoError("That promo code isn't valid or has expired.");
      setPromo(null);
      return;
    }
    setPromo(data);
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  function openPaymentPopup(orderId) {
    const reference = `pay-${orderId}-${Date.now()}`;
    payWithPaystack({
      email: form.email,
      amountNaira: total,
      reference,
      onSuccess: async (paidReference) => {
        setSubmitting(true);
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { orderId, reference: paidReference },
        });
        setSubmitting(false);

        if (error || !data?.ok) {
          setSubmitError(
            "We received your payment but couldn't confirm it automatically. " +
            "Don't worry — your order is saved. Contact us with your order ID: " + orderId
          );
          return;
        }
        clear();
        navigate(`/order-confirmation/${orderId}`);
      },
      onClose: () => {
        setSubmitError("Payment was not completed. You can try again below — your order is still saved.");
      },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    let orderId = pendingOrderId;

    if (!orderId) {
      orderId = makeOrderId();
      const result = await saveOrder({
        id: orderId,
        cartItems: items,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        customer: { ...form },
        userId: user?.id,
        promoCode: promo?.code || null,
        discountAmount,
      });

      if (!result.ok) {
        setSubmitting(false);
        setSubmitError(result.error || "Something went wrong placing your order. Please try again.");
        return;
      }
      setPendingOrderId(orderId);
    }

    setSubmitting(false);
    openPaymentPopup(orderId);
  }

  return (
    <div className="checkout-page">
      <div className="wrap checkout-grid">
        <form className="tnt-form checkout-form" onSubmit={handleSubmit}>
          <h1 className="serif">Delivery Details</h1>
          <label>
            Full Name
            <input required disabled={!!pendingOrderId} value={form.name} onChange={(e) => update("name", e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" required disabled={!!pendingOrderId} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>
          <label>
            Phone
            <input required disabled={!!pendingOrderId} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </label>
          <label>
            Delivery Address
            <textarea required rows={3} disabled={!!pendingOrderId} value={form.address} onChange={(e) => update("address", e.target.value)} />
          </label>
          <label>
            Notes (optional)
            <textarea rows={2} disabled={!!pendingOrderId} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </label>
          {submitError && <div className="form-error">{submitError}</div>}
          <button type="submit" className="cta-btn" style={{ width: "100%" }} disabled={submitting}>
            {submitting
              ? "Please wait…"
              : pendingOrderId
              ? `Retry Payment — ${naira(total)}`
              : `Pay & Place Order — ${naira(total)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3 className="serif">Order Summary</h3>
          {items.map((i) => (
            <div className="summary-row" key={`${i.id}-${i.size}`}>
              <span>{i.qty} × {i.name} ({i.size})</span>
              <span>{naira(i.price * i.qty)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{naira(DELIVERY_FEE)}</span>
          </div>

          {!pendingOrderId && (
            <div style={{ margin: "14px 0" }}>
              {promo ? (
                <div className="summary-row" style={{ color: "var(--pink)" }}>
                  <span>Promo "{promo.code}" applied</span>
                  <span>
                    −{naira(discountAmount)}{" "}
                    <button type="button" onClick={removePromo} style={{ background: "none", border: "none", color: "var(--muted)", textDecoration: "underline", cursor: "pointer", marginLeft: 6 }}>Remove</button>
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="cta-outline" onClick={handleApplyPromo} disabled={checkingPromo}>
                    {checkingPromo ? "…" : "Apply"}
                  </button>
                </div>
              )}
              {promoError && <div className="form-error" style={{ marginTop: 8 }}>{promoError}</div>}
            </div>
          )}

          <div className="summary-row total">
            <span>Total</span>
            <span>{naira(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}