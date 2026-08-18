import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { naira } from "../data/menuData.js";
import { getUserOrders, stageLabel } from "../data/orders.js";
import AddressesCard from "../components/AddressesCard.jsx";
import DeliveryAreaChecker from "../components/DeliveryAreaChecker.jsx";

export default function AccountPage() {
  const { user, logout, updateAvatar, updateProfile } = useAuth();
  const { notify } = useUI();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (user) {
      getUserOrders(user.id).then(setOrders);
      setEditName(user.name);
      setEditPhone(user.phone);
    }
  }, [user]);

  // Live-update order statuses the instant an admin changes them, and notify.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("account-orders")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updated = payload.new;
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o)));
          notify(`Order ${updated.id} is now "${updated.status}"`);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  if (!user) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setAvatarError("");
    const res = await updateAvatar(file);
    setUploading(false);
    if (!res.ok) setAvatarError(res.error);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    const res = await updateProfile({ name: editName.trim(), phone: editPhone.trim() });
    setSavingProfile(false);
    if (!res.ok) {
      setProfileError(res.error);
      return;
    }
    setEditing(false);
    notify("Profile updated");
  }

  const initial = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="account-page">
      <div className="wrap">
        <div className="account-hero">
          <div className="avatar-wrap" onClick={() => fileInputRef.current?.click()}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Your avatar" className="avatar-img" />
            ) : (
              <div className="avatar-fallback">{initial}</div>
            )}
            <div className="avatar-edit-badge">{uploading ? "…" : "✎"}</div>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: "none" }} />
          <div>
            <div className="script" style={{ fontSize: "1.1rem" }}>My Account</div>
            <h1 className="serif" style={{ margin: 0 }}>Hello, {user.name.split(" ")[0]}</h1>
            <p className="muted-text" style={{ margin: "4px 0 0" }}>{user.email}</p>
          </div>
        </div>
        {avatarError && <div className="form-error">{avatarError}</div>}

        <div className="account-grid">
          <div className="account-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0 }}>Profile</h4>
              {!editing && <button className="cta-outline" onClick={() => setEditing(true)}>Edit</button>}
            </div>

            {editing ? (
              <form className="tnt-form" onSubmit={handleSaveProfile} style={{ marginTop: 14 }}>
                {profileError && <div className="form-error">{profileError}</div>}
                <label>
                  Name
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </label>
                <label>
                  Phone
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                </label>
                <div className="admin-form-actions">
                  <button type="submit" className="cta-btn" disabled={savingProfile}>{savingProfile ? "Saving…" : "Save"}</button>
                  <button type="button" className="cta-outline" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="account-info-row"><span>Name</span><strong>{user.name}</strong></div>
                <div className="account-info-row"><span>Email</span><strong>{user.email}</strong></div>
                <div className="account-info-row"><span>Phone</span><strong>{user.phone}</strong></div>
              </>
            )}
            <button className="cta-outline" onClick={handleLogout} style={{ marginTop: 18 }}>Log Out</button>
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

          <AddressesCard />
          <DeliveryAreaChecker />
        </div>
      </div>
    </div>
  );
}