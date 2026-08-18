import React from "react";

const CONTENT = {
  delivery: {
    title: "Delivery Information",
    body: [
      "We currently deliver across Lagos only. Orders placed before 12pm are typically delivered the same day, within 3–4 hours of payment confirmation.",
      "A flat delivery fee is added at checkout and charged separately from the cost of your food. The exact fee is calculated based on your delivery address.",
      "Please make sure someone is available to receive the order at the address provided, as our riders are unable to wait for extended periods.",
      "For same-day delivery questions or urgent orders, reach us on WhatsApp at 0802 552 9215.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By placing an order with Toks 'N' Trays, you agree to provide accurate delivery and contact information so your order can be fulfilled without delay.",
      "All meals are prepared fresh to order. Because of this, orders cannot be cancelled once preparation has begun.",
      "Prices are listed in Nigerian Naira and are subject to change without prior notice. The price shown at checkout is the price you will be charged.",
      "Toks 'N' Trays reserves the right to refuse or cancel an order in cases of incomplete information, suspected fraud, or delivery outside our current service area.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information needed to process your order: your name, phone number, email and delivery address.",
      "Your details are used solely to fulfil your order and to contact you about it. We do not sell or share your personal information with third parties.",
      "Account information is stored securely on your own device for this demo experience and is never transmitted to an external server.",
      "If you have any questions about how your information is handled, please reach out via WhatsApp at 0802 552 9215.",
    ],
  },
};

export default function InfoPage({ page }) {
  const data = CONTENT[page];
  return (
    <div className="checkout-page">
      <div className="wrap auth-wrap" style={{ maxWidth: 720 }}>
        <h1 className="serif">{data.title}</h1>
        {data.body.map((p, i) => (
          <p className="muted-text" key={i} style={{ lineHeight: 1.8, marginBottom: 16 }}>{p}</p>
        ))}
      </div>
    </div>
  );
}
