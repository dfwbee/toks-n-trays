# Deploying the verify-payment Edge Function

Run these from your project root (needs the Supabase CLI: npm install -g supabase).

1. Log in and link your project:
   supabase login
   supabase link --project-ref YOUR-PROJECT-REF

2. Set your Paystack SECRET key (from Paystack dashboard → Settings → API Keys — the sk_test_/sk_live_ one, NOT the public key):
   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx

3. Deploy the function:
   supabase functions deploy verify-payment

4. Test it's live — you should get a JSON response (an error is fine, it just proves it's reachable):
   curl -X POST https://YOUR-PROJECT-REF.supabase.co/functions/v1/verify-payment \
     -H "Content-Type: application/json" \
     -d '{"orderId":"test","reference":"test"}'

Note: your PAYSTACK SECRET key only ever lives in Supabase's secrets — never put it in
your .env or any file inside src/. Only the PUBLIC key (pk_test_/pk_live_) goes in
VITE_PAYSTACK_PUBLIC_KEY.
