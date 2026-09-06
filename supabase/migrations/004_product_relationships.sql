-- Product relationships for FBT and future recommendation types

create table if not exists public.product_relationships (
  source_product_id text not null references public.products(id) on delete cascade,
  target_product_id text not null references public.products(id) on delete cascade,
  relationship_type text not null default 'fbt',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (source_product_id, target_product_id, relationship_type),
  constraint product_relationships_no_self check (source_product_id <> target_product_id)
);

create index if not exists product_relationships_source_type_idx
  on public.product_relationships (source_product_id, relationship_type, sort_order);

alter table public.product_relationships enable row level security;

create policy "Active product relationships are publicly readable"
  on public.product_relationships for select
  using (
    exists (
      select 1 from public.products p
      where p.id = source_product_id and p.is_active = true
    )
    and exists (
      select 1 from public.products p
      where p.id = target_product_id and p.is_active = true
    )
  );

-- Co-purchase recommendations from paid multi-item orders
create or replace function public.get_co_purchase_recommendations(
  p_product_id text,
  p_limit integer default 10
)
returns table(target_product_id text, co_occurrence_count bigint)
language sql
stable
as $$
  with order_products as (
    select
      o.id as order_id,
      (item->>'productId') as product_id
    from public.orders o,
         jsonb_array_elements(o.line_items) as item
    where o.status = 'paid'
      and jsonb_array_length(o.line_items) > 1
  ),
  anchor_orders as (
    select distinct order_id
    from order_products
    where product_id = p_product_id
  ),
  co_products as (
    select
      op.product_id as target_id,
      count(distinct op.order_id) as cnt
    from order_products op
    inner join anchor_orders ao on ao.order_id = op.order_id
    where op.product_id <> p_product_id
    group by op.product_id
  )
  select target_id, cnt
  from co_products
  order by cnt desc
  limit p_limit;
$$;

-- Seed curated FBT pairs (Hair Oil ↔ Hair Grease, PureHeal → Hair Care)
insert into public.product_relationships (source_product_id, target_product_id, relationship_type, sort_order)
values
  ('hair-oil', 'hair-grease', 'fbt', 0),
  ('hair-grease', 'hair-oil', 'fbt', 0),
  ('pureheal-oil', 'hair-oil', 'fbt', 0),
  ('pureheal-oil', 'hair-grease', 'fbt', 1)
on conflict (source_product_id, target_product_id, relationship_type) do nothing;
