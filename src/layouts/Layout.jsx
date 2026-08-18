import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartDrawer from "../components/CartDrawer.jsx";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scrolls to a section id. If not on the home page, navigates home first
  // and lets HomePage's hash-scroll effect finish the job.
  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="tnt-root">
      <Navbar scrollTo={scrollTo} />
      <Outlet />
      <Footer scrollTo={scrollTo} />
      <CartDrawer />
      <button
        className="cta-btn sticky-order"
        onClick={() => navigate("/menu")}
        style={{ borderRadius: 30, boxShadow: "0 10px 24px rgba(0,0,0,0.5)" }}
      >
        Order Now
      </button>
    </div>
  );
}
