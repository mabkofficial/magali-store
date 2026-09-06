-- Magali storefront schema

create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  short_name text not null,
  category text not null,
  price numeric(10, 2) not null,
  currency text not null default 'USD',
  size text not null,
  tagline text not null,
  short_description text not null,
  overview text not null,
  benefits jsonb not null default '[]'::jsonb,
  ingredients jsonb not null default '{}'::jsonb,
  claims jsonb,
  directions jsonb not null,
  caution text not null,
  storage text not null,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  shipping_class text not null default 'standard',
  status text not null default 'active',
  compliance_note text,
  verification_note text,
  nutrition_highlights jsonb,
  inventory_count integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  customer_email text not null,
  line_items jsonb not null,
  shipping_address jsonb,
  shipping_rate_cents integer,
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  total_cents integer not null,
  status text not null default 'paid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Public read for active products
create policy "Active products are publicly readable"
  on public.products for select
  using (is_active = true);

-- Newsletter signups from anon
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Service role bypasses RLS; admin uses service role on server
