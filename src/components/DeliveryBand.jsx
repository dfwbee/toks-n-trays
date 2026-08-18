import React from "react";

export default function DeliveryBand() {
  return (
    <div className="delivery-band">
      <div className="wrap" style={{ padding: "60px 24px" }}>
        <div className="delivery-grid">
          <div>
            <div className="num serif">3–4</div>
            <div className="lbl">Hours After Payment</div>
          </div>
          <div>
            <div className="num serif">Lagos</div>
            <div className="lbl">Current Delivery Area</div>
          </div>
          <div>
            <div className="num serif">₦</div>
            <div className="lbl">Delivery Fee Charged Separately</div>
          </div>
        </div>
      </div>
    </div>
  );
}
