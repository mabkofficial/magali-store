INSERT INTO public.products (id, slug, name, short_name, category, price, currency, size, tagline, short_description, overview, benefits, ingredients, claims, directions, caution, storage, images, featured, shipping_class, status, compliance_note, verification_note, nutrition_highlights, inventory_count, is_active) VALUES
(
  'hair-oil', 'magali-botanical-hair-oil', 'Magali Botanical Hair Oil', 'Botanical Hair Oil', 'Hair Care',
  39.98, 'USD', '8.5 fl oz / 250 ml', 'Nourish, strengthen, and shine', 'A nutrient-rich botanical hair oil with 14 herbal botanicals and three natural oils to nourish the scalp, support stronger-looking hair, and add natural shine.',
  'Magali Botanical Hair Oil blends 14 botanical infusions with olive, castor, and coconut oils in a formula made for everyday scalp and strand care. Suitable for all hair textures, including natural, color-treated, and chemically processed hair.', '["Nourishes the scalp and hair roots","Supports stronger-looking hair and reduced breakage","Enhances natural shine and softness","Helps smooth frizz and improve manageability","Suitable for all hair types and textures"]'::jsonb, '{"naturalOils":["Olive Oil","Castor Oil","Coconut Oil"],"botanicals":["Hibiscus Flower","Neem","Rosemary","Black Seed","Amla","Chebe","Fenugreek","Ginger","Purple Onion","Garlic","Flax Seed","Fennel Seed","Clove","Cinnamon Bark"]}'::jsonb,
  '["Paraben-Free","Sulfate-Free","Cruelty-Free","Made in USA"]'::jsonb,
  '["Apply a small amount directly to the scalp and hair.","Massage gently into the scalp for 3 to 5 minutes.","Leave in as a daily treatment or wash out with shampoo if preferred.","Use 3 to 4 times per week for best results."]'::jsonb, 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children.', 'Store in a cool, dry place away from direct sunlight.',
  '["/images/products/hair-oil/01-hero-white.png","/images/products/hair-oil/02-angled-white.png","/images/products/hair-oil/03-botanical-lifestyle.png"]'::jsonb, true, 'standard', 'active',
  null,
  null,
  null,
  100, true
),
(
  'pureheal-oil', 'magali-pureheal-oil', 'Magali PureHeal Oil', 'PureHeal Oil', 'Wellness',
  24.98, 'USD', '60 ml / 2.03 fl oz', 'Targeted botanical relief', 'A concentrated blend of cold-pressed castor oil and pure clove essential oil in a precise dropper format for targeted external application.',
  'Magali PureHeal Oil pairs cold-pressed castor oil with pure clove essential oil in a 60 ml amber dropper bottle. The lightweight formula is designed for targeted topical use on dry or irritated skin and for massage into areas of everyday muscle or joint stiffness. For external use only.', '["Helps soothe and moisturize dry, rough, or irritated skin","Provides a warming botanical sensation from clove essential oil","Convenient dropper format for targeted application","Can be massaged into areas of everyday muscle or joint stiffness"]'::jsonb, '{"botanicalBlend":["Cold-Pressed Castor Oil","Pure Clove Essential Oil"]}'::jsonb,
  '["100% Pure Botanical Oil Blend","Made in USA"]'::jsonb,
  '["Dispense a few drops onto clean fingertips or a cotton swab.","Apply directly to the external target area.","Use 2 to 3 times daily or as needed."]'::jsonb, 'For external use only. Avoid direct contact with eyes. Keep out of reach of children. Discontinue use if irritation occurs.', 'Store in a cool, dry place away from direct sunlight.',
  '["/images/products/pureheal-oil/01-hero-white.png","/images/products/pureheal-oil/02-botanical-still-life.png","/images/products/pureheal-oil/03-golden-splash.png"]'::jsonb, true, 'standard', 'active',
  null,
  null,
  null,
  100, true
),
(
  'hair-grease', 'magali-herbal-hair-grease', 'Magali Herbal Hair Grease', 'Herbal Hair Grease', 'Hair Care',
  39, 'USD', '185 g / 6.5 oz', 'Herbal goodness rooted in nature', 'A rich herbal hair grease with traditional herbs, natural oils, and shea butter to nourish the scalp, add shine, and improve manageability.',
  'Magali Herbal Hair Grease combines herbs, natural oils, and shea butter in a rich, everyday formula. It supports scalp nourishment, stronger-looking hair, natural shine, and soft, manageable strands for all hair types.', '["Helps nourish the scalp","Supports stronger-looking hair","Adds shine","Helps hair feel soft and manageable","For all hair types"]'::jsonb, '{"formula":["Coriander","Cinnamon Powder","Turmeric","Rosemary","Neem Powder","Fenugreek Powder","Castor Oil","Olive Oil","Coconut Oil","Cloves","Black Seed","Shea Butter"]}'::jsonb,
  '["Natural Ingredients","Scalp Nourishment","Stronger Hair","Adds Shine","Non-Greasy Formula","Daily Care","Made in USA"]'::jsonb,
  '["Take a small amount and apply evenly to scalp and hair.","Massage gently with fingertips.","Use 1 to 3 times a week for best results."]'::jsonb, 'For external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Keep out of reach of children.', 'Store in a cool, dry place away from direct sunlight.',
  '["/images/products/hair-grease/01-hero-white.png","/images/products/hair-grease/02-botanical-still-life.png","/images/products/hair-grease/03-golden-splash.png"]'::jsonb, true, 'standard', 'active',
  null,
  null,
  null,
  100, true
),
(
  'beef-pies', 'magali-caribbean-style-beef-pies-8-pack', 'Magali Caribbean Style Beef Pies, 8 Pack', 'Caribbean Style Beef Pies', 'Food',
  18.98, 'USD', '32 oz / 2 lbs, 8 pack', 'Taste the islands', 'A family-size 8 pack of frozen Caribbean-style beef pies with flaky pastry and a savory seasoned ground beef filling.',
  'Magali Caribbean Style Beef Pies bring bold island flavor to your table in a convenient frozen 8 pack. Each pie features a golden, flaky crust and a seasoned ground beef filling. Cook from frozen in the oven, air fryer, or skillet.', '["Family-size 8 pack","Flaky golden pastry","Savory seasoned ground beef filling","Oven, air fryer, or skillet preparation","Keep frozen until ready to cook"]'::jsonb, '{"protein":["Ground Beef"],"aromatics":["Onion","Garlic","Shallots","Bell Peppers (green, yellow, red)"],"seasoningsAndSpices":["Caribbean All-Purpose Seasoning","Adobo Seasoning","Thyme","Rosemary","Salt","Black Pepper","Red Hot Pepper (optional)","Habanero Peppers","Epis (Haitian Seasoning Base)","Lime Juice","Tomato Paste"],"other":["Enriched all-purpose flour"]}'::jsonb,
  null,
  '{"oven":"Preheat oven to 375°F (190°C). Place frozen pies on a parchment-lined baking tray. Bake 25 to 30 minutes, flipping halfway through, until golden brown and fully heated.","airFryer":"Preheat air fryer to 350°F (175°C). Place pies in a single layer and cook 15 to 18 minutes, flipping halfway through, until crispy and heated through.","skillet":"Heat 2 to 3 tbsp oil in a skillet over medium heat. Place frozen pies in hot oil and cook 6 to 8 minutes per side until golden and fully cooked."}'::jsonb, 'Always ensure pies reach an internal temperature of 160°F (71°C) before serving. Cooking times may vary depending on your oven, air fryer, or stove.', 'Keep frozen.',
  '["/images/products/beef-pies/01-package-white.png","/images/products/beef-pies/02-package-lifestyle.png","/images/products/beef-pies/03-plated-cooked-pies.png"]'::jsonb, true, 'frozen', 'active',
  null,
  null,
  '["420 calories per serving","15 g protein","3 g sugar","0 g trans fat"]'::jsonb,
  100, true
)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, short_name = EXCLUDED.short_name, category = EXCLUDED.category, price = EXCLUDED.price, currency = EXCLUDED.currency, size = EXCLUDED.size, tagline = EXCLUDED.tagline, short_description = EXCLUDED.short_description, overview = EXCLUDED.overview, benefits = EXCLUDED.benefits, ingredients = EXCLUDED.ingredients, claims = EXCLUDED.claims, directions = EXCLUDED.directions, caution = EXCLUDED.caution, storage = EXCLUDED.storage, images = EXCLUDED.images, featured = EXCLUDED.featured, shipping_class = EXCLUDED.shipping_class, status = EXCLUDED.status, compliance_note = EXCLUDED.compliance_note, verification_note = EXCLUDED.verification_note, nutrition_highlights = EXCLUDED.nutrition_highlights, inventory_count = EXCLUDED.inventory_count, is_active = EXCLUDED.is_active, updated_at = now();
