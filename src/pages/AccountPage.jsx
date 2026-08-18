import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { naira } from "../data/menuData.js";
import { getUserOrders, stageLabel } from "../data/orders.js";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      getUserOrders(user.id).then(setOrders);
    }
  }, [user]);

  if (!user) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="account-page">
      <div className="wrap">
        <div className="script" style={{ fontSize: "1.2rem" }}>My Account</div>
        <h1 className="serif">Hello, {user.name.split(" ")[0]}</h1>

        <div className="account-grid">
          <div className="account-card">
            <h4>Profile</h4>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <button className="cta-outline" onClick={handleLogout}>Log Out</button>
          </div>

          <div className="account-card">
            <h4>Order History</h4>
            {orders.length === 0 ? (
              <p className="muted-text">You haven't placed any orders yet. <Link to="/menu">Browse the menu</Link>.</p>
            ) : (
              <div className="order-list">
                {orders.map((o) => (
                  <Link to={`/order-confirmation/${o.id}`} className="order-row" key={o.id}>
                    <div>
                      <div className="order-id">{o.id}</div>
                      <div className="muted-text">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="order-status">{stageLabel(o)}</div>
                    <div className="price">{naira(o.total)}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
