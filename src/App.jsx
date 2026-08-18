import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UIProvider } from "./context/UIContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MenuProvider } from "./context/MenuContext.jsx";
import Layout from "./layouts/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import InfoPage from "./pages/InfoPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
        <CartProvider>
          <UIProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/track" element={<OrderTrackingPage />} />
                <Route path="/track/:orderId" element={<OrderTrackingPage />} />
                <Route path="/delivery-information" element={<InfoPage page="delivery" />} />
                <Route path="/terms" element={<InfoPage page="terms" />} />
                <Route path="/privacy" element={<InfoPage page="privacy" />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              </Route>
            </Routes>
          </UIProvider>
        </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
