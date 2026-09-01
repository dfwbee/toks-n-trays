// Supabase Edge Function: verify-payment
// Deploy with: supabase functions deploy verify-payment
// Requires secrets: PAYSTACK_SECRET_KEY, RESEND_API_KEY
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-provided)

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // 1. Ask Paystack directly: did this transaction actually succeed?
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData?.data || verifyData.data.status !== "success") {
      return json({ ok: false, error: "Payment was not successful." }, 400);
    }

    // 2. Cross-check the amount Paystack actually received against the order total
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

    // 3. Mark the order paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid", paystack_reference: reference })
      .eq("id", orderId);

    if (updateError) {
      return json({ ok: false, error: updateError.message }, 500);
    }

    // 4. Fire the confirmation email in the BACKGROUND — never let a slow or
    //    failed email delay confirming the payment to the customer.
    //    EdgeRuntime.waitUntil lets this keep running after we've already responded.
    const emailTask = (async () => {
      try {
        const { data: lineItems } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);
        await sendConfirmationEmail(order, lineItems || []);
      } catch (emailErr) {
        console.error("Confirmation email failed:", emailErr);
      }
    })();

    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(emailTask);
    }
    // If waitUntil isn't available, emailTask still runs — we just don't await it,
    // so the response below goes out immediately either way.

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
});

async function sendConfirmationEmail(order, lineItems) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return; // not configured yet — skip quietly

  const itemsHtml = lineItems
    .map((i) => `<tr><td style="padding:6px 0;">${i.quantity} × ${i.name} (${i.size})</td><td style="text-align:right;">₦${(i.unit_price * i.quantity).toLocaleString()}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #2a2422;">
      <h2 style="color:#b56f89;">Thank you, ${order.customer_name.split(" ")[0]}!</h2>
      <p>Your order <strong>${order.id}</strong> has been received and is being prepared.</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        ${itemsHtml}
        <tr><td style="padding-top:10px;">Delivery Fee</td><td style="text-align:right; padding-top:10px;">₦${order.delivery_fee.toLocaleString()}</td></tr>
        ${order.discount_amount ? `<tr><td>Discount</td><td style="text-align:right;">−₦${order.discount_amount.toLocaleString()}</td></tr>` : ""}
        <tr><td style="font-weight:bold; padding-top:10px; border-top:1px solid #ddd;">Total</td><td style="text-align:right; font-weight:bold; padding-top:10px; border-top:1px solid #ddd;">₦${order.total.toLocaleString()}</td></tr>
      </table>
      <p>Delivering to: ${order.delivery_address}</p>
      ${order.scheduled_for ? `<p>Scheduled for: ${new Date(order.scheduled_for).toLocaleString("en-NG")}</p>` : ""}
      <p style="margin-top:24px; color:#8a8078;">Toks 'N' Trays — Homemade Luxury. Made With Love.</p>
    </div>
  `;

  // A hard timeout so a slow/unreachable Resend API can never hang this task forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Toks 'N' Trays <orders@toksntrays.com>",
        to: order.customer_email,
        subject: `Order Confirmed — ${order.id}`,
        html,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}