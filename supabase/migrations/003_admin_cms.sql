-- Admin CMS: SEO fields, store settings, storage policies

alter table public.products
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists og_image text;

create table if not exists public.store_settings (
  id text primary key default 'default',
  store_name text not null default 'Magali',
  contact_email text,
  contact_phone text,
  social_instagram text,
  social_facebook text,
  default_meta_description text,
  default_og_image text,
  standard_shipping_cents integer not null default 799,
  frozen_shipping_cents integer not null default 2499,
  shipping_regions text not null default 'United States (contiguous 48 states)',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

create policy "Store settings publicly readable"
  on public.store_settings for select
  using (true);

-- Storage bucket for product assets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'magali-assets',
  'magali-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Public read magali assets"
  on storage.objects for select
  using (bucket_id = 'magali-assets');

create policy "Authenticated upload magali assets"
  on storage.objects for insert
  with check (bucket_id = 'magali-assets' and auth.role() = 'authenticated');

create policy "Authenticated update magali assets"
  on storage.objects for update
  using (bucket_id = 'magali-assets' and auth.role() = 'authenticated');

create policy "Authenticated delete magali assets"
  on storage.objects for delete
  using (bucket_id = 'magali-assets' and auth.role() = 'authenticated');

-- Seed SEO from existing hardcoded titles
update public.products set meta_title = 'Magali Botanical Hair Oil 8.5 fl oz | Nourish, Strengthen & Shine'
where slug = 'magali-botanical-hair-oil' and meta_title is null;

update public.products set meta_title = 'Magali Herbal Hair Grease | Botanical Hair & Scalp Care'
where slug = 'magali-herbal-hair-grease' and meta_title is null;

update public.products set meta_title = 'Magali PureHeal Oil 60 ml | Castor & Clove Botanical Oil'
where slug = 'magali-pureheal-oil' and meta_title is null;

update public.products set meta_title = 'Magali Caribbean Style Beef Pies, 8 Pack | 32 oz'
where slug = 'magali-caribbean-style-beef-pies-8-pack' and meta_title is null;

update public.products set meta_description = short_description
where meta_description is null;
