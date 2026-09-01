// Supabase Edge Function: verify-payment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
if (req.method === "OPTIONS") {
return new Response("ok", { headers: corsHeaders });
}

try {
const { orderId, reference } = await req.json();
if (!orderId || !reference) {
return json({ ok: false, error: "orderId and reference are required" }, 400);
}

const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabase = createClient(
Deno.env.get("SUPABASE_URL"),
Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
headers: { Authorization: `Bearer ${paystackSecret}` },
});
const verifyData = await verifyRes.json();

if (!verifyData?.data || verifyData.data.status !== "success") {
return json({ ok: false, error: "Payment was not successful." }, 400);
}

const { data: order, error: orderError } = await supabase
.from("orders")
.select("*")
.eq("id", orderId)
.single();

if (orderError || !order) {
return json({ ok: false, error: "Order not found." }, 404);
}
if (verifyData.data.amount !== order.total * 100) {
return json({ ok: false, error: "Amount mismatch — payment not accepted." }, 400);
}
if (order.payment_status === "paid") {
return json({ ok: true, alreadyPaid: true });
}

const { error: updateError } = await supabase
.from("orders")
.update({ payment_status: "paid", paystack_reference: reference })
.eq("id", orderId);

if (updateError) {
return json({ ok: false, error: updateError.message }, 500);
}

// Fetch order items for the email
const { data: items } = await supabase
.from("order_items")
.select("*")
.eq("order_id", orderId);

// Send confirmation email — don't let email failure block the response
try {
await sendConfirmationEmail(resendApiKey, order, items || []);
} catch (emailErr) {
console.error("Email send failed:", emailErr);
}

return json({ ok: true });
} catch (err) {
return json({ ok: false, error: err.message }, 500);
}
});

async function sendConfirmationEmail(apiKey, order, items) {
const itemsHtml = items
.map(
(i) =>
`<tr><td style="padding:4px 8px">${i.quantity}x ${i.name} (${i.size || ""})</td><td style="padding:4px 8px">₦${(i.unit_price * i.quantity).toLocaleString()}</td></tr>`
)
.join("");

const html = `
<div style="font-family:sans-serif;max-width:500px;margin:auto">
<h2>Thanks for your order, ${order.customer_name}!</h2>
<p>Order ID: <strong>${order.id}</strong></p>
<table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
<p>Delivery Fee: ₦${order.delivery_fee.toLocaleString()}</p>
<p><strong>Total: ₦${order.total.toLocaleString()}</strong></p>
<p>Delivering to: ${order.delivery_address}</p>
</div>
`;

const res = await fetch("https://api.resend.com/emails", {
method: "POST",
headers: {
Authorization: `Bearer ${apiKey}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
from: "Toks N Trays <orders@toksntrays.com>",
to: order.customer_email,
subject: `Order Confirmed — ${order.id}`,
html,
}),
});

if (!res.ok) {
const errText = await res.text();
throw new Error(`Resend error: ${errText}`);
}
}

function json(body, status = 200) {
return new Response(JSON.stringify(body), {
status,
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
}
