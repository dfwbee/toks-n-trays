# Toks 'N' Trays — Full-Stack Ordering Site

A full online ordering platform for Toks 'N' Trays (hand-crafted Nigerian
soups, stews, and stone-baked pizza, delivered from Ibadan). Built with
React + Vite on the frontend, Supabase for auth/database/storage, and
Paystack for payments.

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually http://localhost:5173).

Requires a `.env` file in the project root (NOT inside `src/`) with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_PAYSTACK_PUBLIC_KEY=...
```

## Build for production
```bash
npm run build
```
Output goes to `dist/`.

## Deploying
Deployed on Vercel. `vercel.json` handles client-side routing so refreshing
any page (e.g. `/admin`) doesn't 404. Environment variables must be added
separately in the Vercel dashboard (Settings → Environment Variables) — they
are not read from your local `.env`.

## Project structure
```
src/
  components/       -> shared UI pieces (Navbar, ProductModal, AddressesCard, etc.)
  components/admin/ -> admin-only dashboard pieces (orders, menu, stats, customers, delivery areas)
  pages/            -> one file per route (Home, Menu, Checkout, Account, Admin, etc.)
  layouts/          -> Layout.jsx (Navbar + Footer wrap every page)
  context/          -> AuthContext (Supabase auth), CartContext, MenuContext, UIContext
  lib/              -> supabaseClient.js, paystack.js
  data/             -> menuData.js (static copy), orders.js (Supabase order queries)
  App.jsx           -> React Router setup, all routes
  App.css           -> all styling (design tokens as CSS variables at top)
supabase/
  *.sql             -> run these in Supabase SQL Editor to set up tables/policies
  functions/        -> verify-payment Edge Function (Paystack server-side verification)
```

## Backend (Supabase)
- **Auth** — signup/login/logout, password reset, admin flag on `profiles`
- **Database tables** — `profiles`, `menu_items`, `orders`, `order_items`,
  `addresses`, `delivery_areas`
- **Storage** — `menu-images` bucket (menu photos), `avatars` bucket (profile photos)
- **Realtime** — `orders` table publishes live updates so customers see order
  status changes without refreshing (enable in Database → Publications)
- **Edge Function** — `verify-payment` confirms Paystack transactions
  server-side before marking an order paid; needs `PAYSTACK_SECRET_KEY` set
  via `supabase secrets set`

All SQL setup files live in `/supabase` — run each one in the Supabase SQL
Editor in the order they were added (schema → seed → auth trigger → storage
→ addresses/delivery areas → avatar support).

## Routes
- `/` — Home
- `/menu` — Full menu, live from Supabase
- `/checkout` — Delivery details + Paystack payment
- `/order-confirmation/:orderId`, `/track/:orderId` — order status
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — auth
- `/account` — profile (editable, with photo upload), saved addresses,
  delivery area checker, order history with live status updates
- `/admin` — admin-only dashboard: Overview, Orders, Menu, Customers,
  Delivery Areas (protected by `AdminRoute`, requires `is_admin = true` on
  the logged-in user's profile)

## Admin access
Make any signed-up user an admin by running in Supabase SQL Editor:
```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'their@email.com');
```

## Notes
- Colors, fonts, and spacing are defined as CSS variables at the top of
  `App.css` — change them there to restyle the whole site at once.
- Menu photos can be uploaded directly from the admin Menu tab (uploads to
  Supabase Storage) or linked via URL.