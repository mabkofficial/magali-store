-- Drop deprecated lifestyle asset from hair oil gallery (file removed from repo).
update public.products
set images = '["/images/products/hair-oil/01-hero-white.png","/images/products/hair-oil/02-angled-white.png"]'::jsonb
where slug = 'magali-botanical-hair-oil';
