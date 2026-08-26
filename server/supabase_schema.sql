-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text check (role in ('farmer', 'aggregator', 'retailer', 'consumer', 'admin')),
  phone text,
  address jsonb,
  wallet_address text,
  farmer_details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- 2. CROPS TABLE
create table public.crops (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references public.profiles(id),
  name text not null,
  variety text,
  category text,
  quantity numeric,
  unit text,
  price_per_unit numeric,
  status text check (status in ('listed', 'harvested', 'sold', 'collected')),
  farm_location jsonb,
  images text[], -- Array of image URLs
  traceability_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  is_active boolean default true,
  is_organic boolean default false,
  views integer default 0,
  qr_code jsonb,
  ai_analysis jsonb,
  availability text default 'available',
  blockchain_produce_id bigint
);

-- 3. ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_id text unique,
  crop_id uuid references public.crops(id),
  seller_id uuid references public.profiles(id),
  buyer_id uuid references public.profiles(id),
  quantity numeric,
  unit text,
  price_per_unit numeric,
  total_amount numeric,
  status text default 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status text default 'pending', -- pending, escrowed, completed, refunded
  payment_method text,
  delivery_address jsonb,
  notes text,
  tracking_updates jsonb default '[]'::jsonb,
  quality_requirements jsonb,
  buyer_rating jsonb,
  farmer_rating jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  expected_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  blockchain_hash text
);

-- 4. COLLECTIONS TABLE (For Aggregators)
create table public.collections (
  id uuid default uuid_generate_v4() primary key,
  collection_id text unique,
  aggregator_id uuid references public.profiles(id),
  farmer_id uuid references public.profiles(id),
  source_crop_id uuid references public.crops(id),
  collected_quantity numeric,
  collected_unit text,
  purchase_price numeric,
  quality_assessment jsonb,
  status text default 'collected', -- collected, in-storage, processed, sold
  collection_location jsonb,
  collection_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  blockchain jsonb,
  traceability_chain jsonb default '[]'::jsonb,
  buyer jsonb -- Optional: to store who bought this collection
);

-- 5. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  title text,
  message text,
  type text, -- info, success, warning, error
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Row Level Security)

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Crops
alter table public.crops enable row level security;
create policy "Crops are viewable by everyone" on public.crops for select using (true);
create policy "Farmers can insert crops" on public.crops for insert with check (auth.uid() = farmer_id);
create policy "Farmers can update own crops" on public.crops for update using (auth.uid() = farmer_id);

-- Orders
alter table public.orders enable row level security;
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = seller_id or auth.uid() = buyer_id);
create policy "Users can insert orders" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "Users can update their own orders" on public.orders for update using (auth.uid() = seller_id or auth.uid() = buyer_id);

-- Collections
alter table public.collections enable row level security;
create policy "Aggregators can view own collections" on public.collections for select using (auth.uid() = aggregator_id);
create policy "Aggregators can insert collections" on public.collections for insert with check (auth.uid() = aggregator_id);
create policy "Aggregators can update own collections" on public.collections for update using (auth.uid() = aggregator_id);

-- Notifications
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- STORAGE BUCKETS (If not already created via UI)
-- You typically create these in the Supabase Dashboard, but here is the logic:
-- Bucket: 'uploads' (public)
-- Policy: Give public read access, authenticated insert access
