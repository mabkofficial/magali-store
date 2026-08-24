# Magali E-commerce Website — Complete Cursor Build Plan

## 1. Project goal

Build a polished, mobile-first e-commerce website for Magali using the four currently supplied products, their working client-provided details, supplied label/package artwork, and generated website images.

The website must feel premium but approachable, with a consistent Magali visual identity across beauty/wellness and Caribbean food products. It should be easy for the client to update later, fast to load, SEO-ready, accessible, and simple to deploy with a GoDaddy-owned domain.

The current products are:

1. Magali Botanical Hair Oil — $39.98 — 8.5 fl oz / 250 ml
2. Magali Herbal Hair Grease — $39.00 — working size 185 g / 6.5 oz
3. Magali PureHeal Oil — $24.98 — 60 ml / 2.03 fl oz
4. Magali Caribbean Style Beef Pies — 8 Pack — $18.98 — 32 oz / 2 lbs

Use `data/products.json` as the working product data source.

---

## 2. Recommended technical approach

### Primary recommendation

Use:

- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS
- `next/image` for image optimization
- Lucide React for icons
- Zod for validating checkout/contact inputs
- Zustand or React Context for a lightweight cart
- Stripe Checkout for payments
- Resend or GoDaddy/SMTP-compatible transactional email only if order/contact email is needed
- Vercel for application hosting
- GoDaddy for domain/DNS management

### Why this approach

Cursor works extremely well with a Next.js/TypeScript codebase. Vercel deployment is simple, supports server-side Stripe endpoints, gives excellent image optimization, and avoids the limitations of trying to run a modern Next.js commerce app inside a basic GoDaddy website builder.

The client can still use a GoDaddy-owned domain. Point the domain DNS to Vercel after the site is approved.

### If the client absolutely requires GoDaddy hosting

Use one of these fallback modes:

1. GoDaddy Linux/cPanel hosting + static export of the storefront + Stripe Payment Links for checkout.
2. GoDaddy VPS + normal Next.js Node deployment.

Do not attempt to paste the custom Cursor/Next.js project into GoDaddy Websites + Marketing. That product is a site builder, not a general custom-code host.

---

## 3. Repository setup

Create the app:

```bash
npx create-next-app@latest magali-store --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd magali-store
npm install lucide-react zustand zod clsx tailwind-merge
npm install stripe @stripe/stripe-js
```

Recommended optional tools:

```bash
npm install react-hook-form @hookform/resolvers
npm install sonner
npm install framer-motion
```

Avoid animation-heavy dependencies unless they improve the experience. The store should feel fast first and decorative second.

---

## 4. Required project structure

```text
magali-store/
├── public/
│   └── images/
│       ├── products/
│       │   ├── hair-oil/
│       │   ├── pureheal-oil/
│       │   ├── hair-grease/
│       │   └── beef-pies/
│       ├── brand/
│       └── homepage/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── shop/page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── collections/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── shipping-returns/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── api/checkout/route.ts
│   │   └── api/contact/route.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── product/
│   │   ├── shop/
│   │   ├── cart/
│   │   └── ui/
│   ├── data/
│   │   └── products.ts
│   ├── lib/
│   │   ├── products.ts
│   │   ├── currency.ts
│   │   ├── stripe.ts
│   │   ├── seo.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── cart-store.ts
│   └── types/
│       └── product.ts
├── .env.local
└── README.md
```

Copy the provided `public/images/products` directory directly into the new project's `public/images/products` directory.

---

## 5. Brand and visual system

### Core visual direction

The beauty/wellness line uses:

- Deep forest green
- Warm metallic gold
- Soft cream
- Amber glass
- Botanical textures

The food line introduces:

- Rich Magali red
- Deep navy
- Gold accents
- Warm food photography

The site should still feel like one brand. Do not make the food section look like a completely separate website.

### Suggested design tokens

```css
:root {
  --magali-green-950: #10271f;
  --magali-green-900: #173128;
  --magali-green-800: #214537;
  --magali-gold-600: #b8872e;
  --magali-gold-500: #c99a3d;
  --magali-cream-50: #fbf8f1;
  --magali-cream-100: #f4efe4;
  --magali-red-700: #9f1f24;
  --magali-red-600: #b8252b;
  --magali-navy-800: #17355f;
  --magali-ink: #1c211f;
}
```

### Typography

Use a premium serif for display headings and a highly readable sans-serif for UI/body.

Recommended:

- Display: Cormorant Garamond or Playfair Display
- Body/UI: Inter or Manrope

Use `next/font/google` rather than loading fonts with manual external CSS.

### Shape and spacing language

- Rounded cards: 18–24 px radius
- Buttons: 10–14 px radius
- Generous vertical spacing on desktop
- Tight but breathable mobile spacing
- Soft shadows, not harsh e-commerce drop shadows
- Gold border accents used sparingly

---

## 6. Global layout

### Announcement bar

Use a small top bar for a working message such as:

`Botanical beauty • Caribbean flavor • Made with care`

Do not claim free shipping until the client confirms it.

### Header

Desktop:

- Left: Magali wordmark/logo
- Center: Home, Shop, Hair Care, Wellness, Food, About
- Right: Search icon, cart icon

Mobile:

- Hamburger
- Centered brand
- Cart icon

Make header sticky after first scroll, with a subtle background blur.

### Footer

Four columns:

1. Brand summary
2. Shop links
3. Customer care
4. Contact/social/newsletter

Footer must include:

- Shipping & Returns
- Privacy Policy
- Terms
- Contact
- Copyright

Do not invent social links. Keep hidden until supplied.

---

## 7. Sitemap and pages

Build these routes:

- `/` — Home
- `/shop` — All products
- `/collections/hair-care` — Hair Oil + Hair Grease
- `/collections/wellness` — PureHeal Oil
- `/collections/food` — Beef Pies
- `/products/magali-botanical-hair-oil`
- `/products/magali-herbal-hair-grease`
- `/products/magali-pureheal-oil`
- `/products/magali-caribbean-style-beef-pies-8-pack`
- `/cart`
- `/about`
- `/faq`
- `/contact`
- `/shipping-returns`
- `/privacy`
- `/terms`

---

## 8. Homepage specification

### Section 1 — Hero

Goal: introduce Magali as a lifestyle brand without forcing one product category.

Desktop layout:

- Left: headline, copy, CTAs
- Right: layered product imagery featuring Hair Oil + Hair Grease + PureHeal

Suggested working copy:

**Headline:** `Rooted in Nature. Made for Everyday Life.`

**Subheadline:** `Discover botanical hair and wellness essentials alongside bold Caribbean favorites from Magali.`

Primary CTA: `Shop All Products`
Secondary CTA: `Explore Hair Care`

Use Hair Oil lifestyle imagery as the dominant visual.

### Section 2 — Shop by category

Three category cards:

- Hair Care
- Wellness
- Caribbean Food

Each card uses a strong product visual and links to its collection.

### Section 3 — Featured products

Show all four products in a clean product grid.

Each product card contains:

- Image
- Category eyebrow
- Product name
- Size
- Price
- Quick Add button

Do not put long descriptions in grid cards.

### Section 4 — Hair-care brand story

Two-column feature using Hair Oil botanical lifestyle image.

Suggested heading:

`Botanical Care From Root to Tip`

Use concise copy about the oils/herbs currently supplied by the client.

### Section 5 — Wellness spotlight

Feature PureHeal with amber dropper imagery. Keep claims conservative in the public homepage block.

Use heading:

`Targeted Botanical Care`

Suggested copy:

`A concentrated castor-and-clove botanical blend in a convenient dropper format for targeted external application.`

### Section 6 — Food spotlight

Use the plated Beef Pies image and red/navy accents.

Heading:

`A Taste of the Caribbean`

Copy:

`Flaky pastry, savory seasoned beef, and family-size convenience—ready for the oven, air fryer, or skillet.`

CTA: `Shop Beef Pies`

### Section 7 — Trust/value strip

Use only supported points:

- Botanical ingredients
- Thoughtfully prepared formulas
- Made in USA on applicable beauty products
- Convenient everyday care

Do not imply the beef pies are Made in USA unless verified.

### Section 8 — Email signup

Heading:

`Stay Connected With Magali`

Collect email only. Do not require a full account system for v1.

---

## 9. Shop page

### Layout

- Page title
- Intro copy
- Category chips
- Sort dropdown
- Responsive product grid

Filters can be simple because there are only four products.

Recommended categories:

- All
- Hair Care
- Wellness
- Food

Sort:

- Featured
- Price: Low to High
- Price: High to Low
- Name

Use client-side filtering initially.

---

## 10. Product card component

Component: `ProductCard.tsx`

Props:

```ts
type ProductCardProps = {
  product: Product;
  priority?: boolean;
};
```

Behavior:

- Entire image/title area links to PDP
- Quick Add adds quantity 1
- Hover swaps first image to second image on desktop
- No image swap on touch devices
- Price formatted with `Intl.NumberFormat`
- Accessible button labels

---

## 11. Product detail page template

Every PDP should use one shared template fed by product data.

### Above the fold

Desktop:

- Left 58%: image gallery
- Right 42%: product information

Mobile:

- Image carousel first
- Product details below

### Right-side information order

1. Category eyebrow
2. Product title
3. Price
4. Size
5. Short description
6. Quantity selector
7. Add to Cart
8. Shipping note
9. Compact benefit list

### Gallery

Use all three provided images.

Main image should use the white-background image where available.

### Content accordions below

- Overview
- Benefits
- Ingredients
- How to Use / Cooking Instructions
- Caution
- Storage

For food, add:

- Nutrition Highlights
- Cooking Methods

For PureHeal, keep claim language conservative and preserve the external-use caution.

### Related products

Hair Oil → Hair Grease
Hair Grease → Hair Oil
PureHeal → Hair Care products
Beef Pies → no forced cross-category recommendation unless design needs it

---

## 12. Complete working product content

The canonical structured copy is in `data/products.json`. Import it into `src/data/products.ts` or convert it into a typed TypeScript array.

### Hair Oil

Price: `$39.98`

Size: `8.5 fl oz / 250 ml`

Positioning: `Nourish • Strengthen • Shine`

Natural oils:

- Olive Oil
- Castor Oil
- Coconut Oil

Botanical infusions:

- Hibiscus Flower
- Neem
- Rosemary
- Black Seed
- Amla
- Chebe
- Fenugreek
- Ginger
- Purple Onion
- Garlic
- Flax Seed
- Fennel Seed
- Clove
- Cinnamon Bark

Directions:

- Apply a small amount to scalp and hair.
- Massage 3–5 minutes.
- Leave in or wash out with shampoo.
- Use 3–4 times per week.

Claims currently supplied:

- Paraben-Free
- Sulfate-Free
- Cruelty-Free
- Made in USA

### Hair Grease

Price: `$39.00`

Working size: `185 g / 6.5 oz`

Ingredients:

- Coriander
- Cinnamon Powder
- Turmeric
- Rosemary
- Neem Powder
- Fenugreek Powder
- Castor Oil
- Olive Oil
- Coconut Oil
- Cloves
- Black Seed
- Shea Butter

Directions:

- Apply a small amount evenly to scalp and hair.
- Massage gently.
- Use 1–3 times weekly.

Working label benefits:

- Natural ingredients
- Scalp nourishment
- Stronger-looking hair
- Adds shine
- Non-greasy formula
- Daily care

### PureHeal Oil

Price: `$24.98`

Size: `60 ml / 2.03 fl oz`

Ingredients:

- Cold-Pressed Castor Oil
- Pure Clove Essential Oil

Suggested external use:

- Apply a few drops to clean fingertips or cotton swab.
- Apply externally to the target area.
- Use 2–3 times daily or as needed.

Caution:

- External use only
- Avoid eyes
- Keep out of reach of children
- Discontinue if irritation occurs

Important: client-provided materials contain health/relief claims. Before production launch, review the final wording for regulatory/compliance suitability and consistency with the external-use instruction.

### Beef Pies

Price: `$18.98`

Pack: `8 pies`

Net weight: `32 oz / 2 lbs`

Nutrition highlights currently supplied:

- 420 calories per serving
- 15 g protein
- 3 g sugar
- 0 g trans fat

Ingredients from current package artwork:

Protein:
- Ground Beef

Aromatics:
- Onion
- Garlic
- Shallots
- Bell Peppers: green, yellow, red

Seasonings/spices:
- Caribbean All-Purpose Seasoning
- Adobo Seasoning
- Thyme
- Rosemary
- Salt
- Black Pepper
- Red Hot Pepper optional
- Habanero Peppers
- Epis / Haitian Seasoning Base
- Lime Juice
- Tomato Paste

Other:
- Enriched all-purpose flour

Cooking:

Oven:
- 375°F / 190°C
- Frozen pies on parchment-lined tray
- 25–30 minutes
- Flip halfway

Air fryer:
- 350°F / 175°C
- Single layer
- 15–18 minutes
- Flip halfway

Skillet:
- 2–3 tbsp oil
- Medium heat
- 6–8 minutes per side

Food-safety requirement:

- Internal temperature 160°F / 71°C before serving

Storage:

- Keep frozen

---

## 13. Cart architecture

Use a lightweight Zustand cart store.

Cart item shape:

```ts
type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shippingClass: "standard" | "frozen";
};
```

Features:

- Add to cart
- Increase/decrease quantity
- Remove
- Clear cart
- Persist cart in localStorage
- Cart icon count
- Cart subtotal

Do not calculate final shipping or tax in the browser.

---

## 14. Checkout strategy

### Stripe Checkout

Create `/api/checkout/route.ts`.

Server endpoint should:

1. Receive only product IDs and quantities from client.
2. Re-read authoritative prices from the server product data.
3. Never trust client-submitted prices.
4. Convert USD to cents.
5. Create Stripe Checkout Session.
6. Return checkout URL.

### Frozen food constraint

Beef Pies need a distinct shipping class because frozen fulfillment is not yet confirmed.

Implement one of these temporary behaviors via config:

```ts
export const FROZEN_CHECKOUT_ENABLED = false;
```

If `false`:

- Beef Pies can still appear in the store.
- Add to cart can work.
- Checkout displays: `Frozen-item shipping is being finalized. Please contact Magali to order this item.`

Once client supplies shipping rules, enable Stripe shipping rates for frozen products.

This is safer than inventing frozen shipping costs.

---

## 15. Contact page

Fields:

- Name
- Email
- Phone optional
- Subject
- Message

Validate with Zod.

Show success/error toast.

Add contact details only when supplied by client.

Anti-spam:

- Honeypot hidden field
- Rate-limit if hosted serverlessly
- Optional Cloudflare Turnstile later

---

## 16. About page

Current content should stay high-level because no complete founder story has been provided.

Suggested structure:

1. Hero: `Everyday Products, Rooted in Care`
2. Short Magali brand introduction
3. Botanical beauty/wellness philosophy
4. Caribbean food heritage section
5. Quality values
6. CTA to Shop

Do not invent dates, family history, certifications, sourcing origins, or founder biography.

---

## 17. FAQ page

Use product-supported questions only.

Suggested questions:

### Hair Oil
- How often should I use Magali Botanical Hair Oil?
- Is it suitable for all hair types?
- Can I leave it in my hair?

### Hair Grease
- How often should I use the hair grease?
- Is it suitable for all hair types?

### PureHeal
- How do I apply PureHeal Oil?
- What are its ingredients?
- Is it for external use only?

### Beef Pies
- How many pies are in a pack?
- Do I cook them from frozen?
- Can I use an air fryer?
- What internal temperature should they reach?

Shipping questions should be added only after client gives shipping rules.

---

## 18. Policy pages

Create readable placeholders in code, but mark them clearly as requiring client/legal review.

### Shipping & Returns

Must eventually define:

- Processing times
- Standard beauty-product shipping regions
- Frozen food shipping zones
- Frozen packaging fees
- Local pickup/delivery if offered
- Return eligibility for cosmetics/wellness
- Food return/refund rules

Do not invent these terms.

### Privacy

Include:

- Contact-form data
- Checkout provider/Stripe
- Analytics/cookies if enabled
- Newsletter signup if enabled

### Terms

Include general e-commerce terms but flag for legal review.

---

## 19. Image implementation

The handoff already contains these product assets.

### Hair Oil

- `01-hero-white.png`
- `02-angled-white.png`
- `03-botanical-lifestyle.png`

### PureHeal

- `01-hero-white.png`
- `02-botanical-still-life.png`
- `03-golden-splash.png`

### Hair Grease

- `01-hero-white.png`
- `02-botanical-still-life.png`
- `03-golden-splash.png`

### Beef Pies

- `01-package-white.png`
- `02-package-lifestyle.png`
- `03-plated-cooked-pies.png`

### Image rules

- Use `next/image` everywhere.
- Main product image should be square.
- Use `sizes` correctly.
- Product cards use aspect ratio 1:1.
- Never stretch images.
- Add descriptive alt text.
- Hero/lifestyle images may use `object-cover`; white product images use `object-contain`.

### Important image QA

The images are AI-generated working assets based on supplied labels and packaging references. Before commercial launch:

- Compare product name spelling.
- Compare size/weight.
- Compare claims.
- Compare ingredient illustrations/text.
- Replace any render whose visible package copy differs materially from the approved label.

---

## 20. SEO plan

### Site metadata

Use a default title template:

`%s | Magali`

Default description:

`Shop Magali botanical hair care, targeted wellness products, and Caribbean-style food favorites.`

### Product metadata examples

Hair Oil title:

`Magali Botanical Hair Oil 8.5 fl oz | Nourish, Strengthen & Shine`

Hair Grease title:

`Magali Herbal Hair Grease | Botanical Hair & Scalp Care`

PureHeal title:

`Magali PureHeal Oil 60 ml | Castor & Clove Botanical Oil`

Beef Pies title:

`Magali Caribbean Style Beef Pies 8 Pack | 32 oz`

### Structured data

Add JSON-LD Product schema on each PDP with:

- name
- description
- image
- brand
- sku
- offers.price
- offers.priceCurrency
- availability only if inventory is known

Do not add review/rating schema until real reviews exist.

---

## 21. Accessibility requirements

Must pass basic WCAG-oriented QA:

- Visible keyboard focus
- Semantic buttons and links
- Minimum contrast
- Form labels
- Alt text
- Skip-to-content link
- No text embedded as the only source of critical information
- Cart controls accessible by keyboard
- Reduced-motion support for animations

---

## 22. Performance requirements

Target:

- Lighthouse performance 90+ on major pages where practical
- Avoid huge JS bundles
- Lazy-load below-fold imagery
- Use Next image optimization
- Avoid autoplay video
- Avoid excessive carousels
- Use static generation for product pages where possible

---

## 23. Responsive breakpoints

Mobile first.

Recommended behavior:

### 320–639 px

- Single-column layouts
- Sticky mobile add-to-cart on PDP optional
- Horizontal image swipe gallery
- Compact navigation drawer

### 640–1023 px

- 2-column product grids
- Hero may remain stacked

### 1024+ px

- 4-column product grid
- Split hero
- 2-column PDP

---

## 24. Analytics

Optional after client approval:

- Google Analytics 4
- Meta Pixel if client advertises on Meta
- Google Search Console

Use environment flags so analytics can be disabled during staging.

---

## 25. Environment variables

Example `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
CONTACT_TO_EMAIL=
RESEND_API_KEY=
NEXT_PUBLIC_GA_ID=
```

Never commit real secrets.

---

## 26. GoDaddy domain setup

Recommended final deployment flow:

1. Build and test project locally.
2. Push to GitHub.
3. Import repository into Vercel.
4. Deploy staging URL.
5. Complete client review.
6. In GoDaddy DNS, connect the client's domain to Vercel using the exact DNS records Vercel provides.
7. Add both apex domain and `www`.
8. Choose canonical domain.
9. Verify SSL.
10. Confirm redirects.

Do not change nameservers unnecessarily if the client uses GoDaddy email or other DNS services. Prefer adding only required A/CNAME records.

---

## 27. Cursor implementation sequence

### Phase A — Foundation

- Initialize Next.js project.
- Install dependencies.
- Copy assets.
- Create product types/data.
- Add design tokens/fonts.
- Create layout/header/footer.

Acceptance:

- App builds with no TypeScript errors.
- All four products load from data.
- Header/footer responsive.

### Phase B — Commerce UI

- ProductCard
- ProductGrid
- Shop page
- Collection pages
- Product detail template
- Image gallery

Acceptance:

- Every product has a working PDP.
- All three images display.
- Prices/sizes match working data.

### Phase C — Cart

- Zustand store
- Local persistence
- Cart drawer/page
- Quantity management

Acceptance:

- Reload preserves cart.
- Subtotal correct.
- No negative quantities.

### Phase D — Checkout

- Stripe endpoint
- Price verification server-side
- Success/cancel handling
- Frozen item guard

Acceptance:

- Test mode checkout works for standard items.
- Browser cannot override product price.
- Frozen-item behavior follows config.

### Phase E — Content pages

- About
- FAQ
- Contact
- Policy pages

Acceptance:

- No invented client facts.
- Unknown operational terms marked for review.

### Phase F — SEO/accessibility/performance

- Metadata
- Sitemap
- robots
- Product schema
- Keyboard QA
- Image optimization

### Phase G — Launch

- Stripe live keys
- Real client contact info
- Approved shipping rules
- Approved policy text
- Product-detail QA
- GoDaddy DNS to production

---

## 28. Launch QA checklist

### Product data

- [ ] Hair Oil price $39.98
- [ ] PureHeal price $24.98
- [ ] Hair Grease price $39.00
- [ ] Beef Pies price $18.98
- [ ] Hair Oil size checked
- [ ] PureHeal size checked
- [ ] Hair Grease final size confirmed
- [ ] Beef Pies 8-pack / 32 oz confirmed

### Product names

- [ ] Hair Oil final official name confirmed
- [ ] Beef Pies vs Patties/Pasties confirmed

### Claims

- [ ] PureHeal public claims approved
- [ ] External-use wording consistent
- [ ] Hair product claims match label

### Food

- [ ] Allergen statement confirmed
- [ ] Nutrition panel confirmed
- [ ] Frozen shipping method confirmed
- [ ] Internal-temperature guidance retained

### Store operations

- [ ] Shipping regions
- [ ] Shipping rates
- [ ] Taxes
- [ ] Returns
- [ ] Order email
- [ ] Inventory
- [ ] Payment account

### Technical

- [ ] Mobile QA
- [ ] Desktop QA
- [ ] Checkout test
- [ ] Contact form test
- [ ] 404 page
- [ ] Metadata
- [ ] Analytics
- [ ] Domain
- [ ] SSL

---

## 29. Items intentionally left for later confirmation

These should not block development now:

1. Hair Grease: client called it 8 oz, label currently says 185 g / 6.5 oz.
2. PureHeal: client calls it 2 oz while label shows 60 ml / 2.03 fl oz.
3. Hair Oil: client uses Hair Oil / Hair Growth Oil / Botanical Hair Oil terminology.
4. Beef Pies: pies vs patties/pasties naming.
5. Beef Pies: final allergen statement.
6. PureHeal: final compliant public-facing claim language.
7. Frozen-food shipping method and cost.
8. Final business contact/social information.
9. Client shipping, return, privacy, and legal policies.

Build the site so these values are centralized and easy to change rather than hard-coded across components.

---

## 30. Definition of done

The v1 website is considered complete when:

- All four products have polished product pages.
- Each product uses its three provided images.
- Shop and category browsing works.
- Cart works and persists.
- Standard products can use a secure Stripe checkout in test/live mode once keys are provided.
- Frozen-food checkout is safely gated until shipping is configured.
- Homepage is fully responsive and visually branded.
- About, FAQ, Contact, and policy pages exist.
- SEO metadata and Product schema are present.
- Site is accessible by keyboard and mobile friendly.
- No unresolved client assumption is hidden; all launch-critical unknowns are tracked.
- The production domain can be connected through GoDaddy DNS.
