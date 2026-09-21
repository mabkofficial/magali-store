-- Customer accounts: profiles, addresses, wishlists, order ownership

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  is_default boolean not null default false,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_addresses_user_id_idx
  on public.customer_addresses (user_id);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text references public.products (id) on delete cascade,
  bundle_id text,
  created_at timestamptz not null default now(),
  constraint wishlist_one_target check (
    (product_id is not null and bundle_id is null)
    or (product_id is null and bundle_id is not null)
  )
);

create unique index if not exists wishlist_items_user_product_idx
  on public.wishlist_items (user_id, product_id)
  where product_id is not null;

create unique index if not exists wishlist_items_user_bundle_idx
  on public.wishlist_items (user_id, bundle_id)
  where bundle_id is not null;

create index if not exists wishlist_items_user_id_idx
  on public.wishlist_items (user_id);

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null,
  add column if not exists tracking_carrier text,
  add column if not exists tracking_number text;

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.wishlist_items enable row level security;

create policy "Users manage own profile"
  on public.customer_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own addresses"
  on public.customer_addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own wishlist"
  on public.wishlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);
