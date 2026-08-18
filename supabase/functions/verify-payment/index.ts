// Supabase Edge Function: verify-payment
// Deploy with: supabase functions deploy verify-payment
// Requires secrets: PAYSTACK_SECRET_KEY (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-provided)

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") // service role bypasses RLS — safe here, this runs server-side only
    );

    // 1. Ask Paystack directly: did this transaction actually succeed?
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData?.data || verifyData.data.status !== "success") {
      return json({ ok: false, error: "Payment was not successful." }, 400);
    }

    // 2. Cross-check the amount Paystack actually received against the order total,
    //    so a tampered client-side amount can't sneak a cheaper "paid" order through.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("total, payment_status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return json({ ok: false, error: "Order not found." }, 404);
    }
    if (verifyData.data.amount !== order.total * 100) {
      return json({ ok: false, error: "Amount mismatch — payment not accepted." }, 400);
    }
    if (order.payment_status === "paid") {
      return json({ ok: true, alreadyPaid: true }); // avoid double-processing on retry
    }

    // 3. Mark the order paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid", paystack_reference: reference })
      .eq("id", orderId);

    if (updateError) {
      return json({ ok: false, error: updateError.message }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: err.message }, 500);
  }
});

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
