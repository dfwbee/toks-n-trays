import { supabase } from "../lib/supabaseClient.js";

export const ORDER_STAGES = ["Received", "Preparing", "Out for Delivery", "Delivered"];

export function makeOrderId() {
  return "TNT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}


export async function saveOrder({ id, cartItems, subtotal, deliveryFee, total, customer, userId, promoCode, discountAmount }) {
  const { error: orderError } = await supabase.from("orders").insert({
    id,
    user_id: userId || null,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    delivery_address: customer.address,
    notes: customer.notes || null,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    promo_code: promoCode || null,
    discount_amount: discountAmount || 0,
    status: "Received",
    payment_status: "pending",
  });
  if (orderError) return { ok: false, error: orderError.message };

  const lineItems = cartItems.map((i) => ({
    order_id: id,
    menu_item_id: i.id,
    name: i.name,
    size: i.size,
    unit_price: i.price,
    quantity: i.qty,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(lineItems);
  if (itemsError) return { ok: false, error: itemsError.message };

  return { ok: true };
}


export async function getOrder(id) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !order) return null;

  const { data: lineItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return {
    id: order.id,
    items: (lineItems || []).map((i) => ({
      id: i.menu_item_id,
      name: i.name,
      size: i.size,
      price: i.unit_price,
      qty: i.quantity,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    status: order.status,
    paymentStatus: order.payment_status,
    customer: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.delivery_address,
      notes: order.notes,
    },
    createdAt: order.created_at,
  };
}


export function currentStage(order) {
  return ORDER_STAGES.indexOf(order.status);
}

export function stageLabel(order) {
  return order.status;
}


export async function getUserOrders(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((o) => ({
    id: o.id,
    total: o.total,
    status: o.status,
    createdAt: o.created_at,
  }));
}