-- ==========================================
-- TOKS 'N' TRAYS — SUPABASE SCHEMA
-- Run this in Supabase Dashboard → SQL Editor
-- ==========================================

-- 1. PROFILES (extends Supabase's built-in auth.users with name/phone)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- 2. MENU ITEMS
create table if not exists menu_items (
  id text primary key,               -- e.g. 'pz-1' (keep your existing ids)
  name text not null,
  category text not null,            -- 'pizza' | 'soup' | 'stew'
  tag text,                          -- short description
  sizes jsonb not null,              -- e.g. {"Medium": 10500, "X-Large": 15500}
  img text,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- 3. ORDERS
create table if not exists orders (
  id text primary key,               -- e.g. 'TNT-AB12CD'
  user_id uuid references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  notes text,
  subtotal integer not null,
  delivery_fee integer not null default 3000,
  total integer not null,
  status text not null default 'Received',  -- Received | Preparing | Out for Delivery | Delivered
  payment_status text not null default 'pending', -- pending | paid | failed
  paystack_reference text,
  created_at timestamptz default now()
);

-- 4. ORDER ITEMS (line items inside an order)
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id text references orders(id) on delete cascade,
  menu_item_id text references menu_items(id),
  name text not null,        -- snapshot of name at time of order
  size text not null,
  unit_price integer not null,
  quantity integer not null default 1
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- Think of this as: "who's allowed to read/write which rows"
-- ==========================================

alter table profiles enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: users can see/edit only their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Menu items: anyone can read; only admins can write
create policy "Anyone can view menu" on menu_items
  for select using (true);
create policy "Admins can manage menu" on menu_items
  for all using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Orders: users see only their own orders; admins see all
create policy "Users can view own orders" on orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "Admins can update orders" on orders
  for update using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Order items: follow the same visibility as their parent order
create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
    )
  );
create policy "Users can insert own order items" on order_items
  for insert with check (true);
