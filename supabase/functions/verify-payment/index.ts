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

    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

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
  const logoUrl = "https://toksntrays.com/favicon.svg";

  const itemsHtml = items
    .map(
      (i) => `
<tr>
<td style="padding:10px 0;border-bottom:1px solid #333;color:#f5f5f5;font-size:14px">
${i.quantity}x ${i.name}${i.size ? ` (${i.size})` : ""}
</td>
<td style="padding:10px 0;border-bottom:1px solid #333;color:#f4b8c9;font-size:14px;text-align:right">
₦${(i.unit_price * i.quantity).toLocaleString()}
</td>
</tr>`
    )
    .join("");

  const html = `
<div style="background:#000;padding:40px 0;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:480px;margin:auto;background:#0d0d0d;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">
<div style="background:#000;padding:28px 24px;text-align:center;border-bottom:1px solid #2a2a2a;">
<img src="${logoUrl}" alt="Toks 'N' Trays" style="width:48px;height:48px;border-radius:50%;margin-bottom:10px" />
<h1 style="color:#f4b8c9;font-size:22px;letter-spacing:3px;margin:0;font-weight:normal;">TOKS 'N' TRAYS</h1>
<p style="color:#999;font-size:11px;letter-spacing:2px;margin:4px 0 0;">HOMEMADE LUXURY</p>
</div>
<div style="padding:28px 24px;">
<h2 style="color:#fff;font-size:18px;font-weight:normal;margin:0 0 4px;">Thank you, ${order.customer_name}!</h2>
<p style="color:#999;font-size:13px;margin:0 0 24px;">Your order has been received and is being prepared.</p>
<div style="background:#000;border:1px solid #2a2a2a;border-radius:8px;padding:16px;margin-bottom:20px;">
<p style="color:#f4b8c9;font-size:12px;letter-spacing:1px;margin:0 0 4px;">ORDER ID</p>
<p style="color:#fff;font-size:16px;margin:0;">${order.id}</p>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
${itemsHtml}
</table>
<table style="width:100%;font-size:14px;color:#ccc;">
<tr>
<td style="padding:4px 0;">Delivery Fee</td>
<td style="padding:4px 0;text-align:right;">₦${order.delivery_fee.toLocaleString()}</td>
</tr>
<tr>
<td style="padding:8px 0;color:#fff;font-size:16px;border-top:1px solid #333;">Total</td>
<td style="padding:8px 0;color:#f4b8c9;font-size:16px;text-align:right;border-top:1px solid #333;">₦${order.total.toLocaleString()}</td>
</tr>
</table>
<div style="margin-top:24px;padding-top:20px;border-top:1px solid #2a2a2a;">
<p style="color:#f4b8c9;font-size:12px;letter-spacing:1px;margin:0 0 4px;">DELIVERING TO</p>
<p style="color:#ccc;font-size:14px;margin:0;">${order.delivery_address}</p>
</div>
</div>
<div style="background:#000;padding:20px 24px;text-align:center;border-top:1px solid #2a2a2a;">
<p style="color:#666;font-size:11px;margin:0;">Prepared fresh and delivered with care</p>
</div>
</div>
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