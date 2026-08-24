# Ready-to-Paste Master Cursor Prompt

Paste the following into Cursor Agent after creating a clean Next.js repository and copying this handoff bundle into the project.

---

You are the senior full-stack engineer and product designer for the Magali e-commerce website.

Build the complete production-quality storefront described in `docs/CURSOR_BUILD_PLAN.md`.

## Source of truth

1. Treat `data/products.json` as the working structured product source of truth.
2. Use the images already available under `public/images/products/`.
3. Use `references/labels/` only for visual/content QA; do not expose reference files publicly.
4. Do not invent missing client facts, shipping rates, tax rates, inventory counts, allergen declarations, certifications, reviews, social profiles, or founder history.
5. Preserve unresolved issues as centralized configuration/comments/TODOs rather than spreading placeholder values across the UI.

## Stack

Use:

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- next/image
- Lucide icons
- Zustand cart with localStorage persistence
- Zod for API/form validation
- Stripe Checkout server endpoint

## Required pages

- Home
- Shop
- Hair Care collection
- Wellness collection
- Food collection
- Product page for all four products
- Cart
- About
- FAQ
- Contact
- Shipping & Returns
- Privacy
- Terms

## Design

Follow the Magali visual system in the plan:

- forest green, gold, cream as the core palette
- red/navy accents for food
- premium serif display font + modern sans-serif body font
- botanical, warm, polished, premium, mobile-first
- do not overuse gradients or animation
- product imagery must remain the visual focus

## Commerce rules

- Never trust prices from the browser.
- Re-resolve product price server-side from product data before creating Stripe line items.
- Standard items may proceed to Stripe.
- Frozen Beef Pies must use a configurable frozen-shipping guard until frozen shipping is explicitly enabled.
- Never invent shipping costs.

## Product imagery

Use the exact provided paths from product data. White-background image should normally be first on product cards/PDPs.

## Content safety/accuracy

PureHeal client material contains stronger medical-style relief wording. Keep the public marketing copy conservative and external-use consistent. Do not add new therapeutic claims. Keep a code TODO for final compliance review.

The Hair Grease size, Hair Oil naming, Beef Pies naming/allergens, and frozen shipping are working values pending confirmation. Centralize these values so they are easy to update.

## Implementation order

1. Inspect the full handoff files.
2. Create product types and data loader.
3. Create global tokens/fonts/layout.
4. Build header/footer.
5. Build reusable ProductCard and ProductGrid.
6. Build Home.
7. Build Shop and collection pages.
8. Build dynamic PDP.
9. Build Zustand cart.
10. Build cart page/drawer.
11. Build Stripe checkout API.
12. Build content pages.
13. Add metadata, sitemap, robots, and Product JSON-LD.
14. Run lint/typecheck/build.
15. Fix every error.
16. Do responsive/accessibility QA.

## Code quality requirements

- Reusable components rather than duplicated page markup.
- No `any` unless unavoidable and documented.
- Semantic HTML.
- Accessible interactive controls.
- Keep server-only secrets server-side.
- Use environment variables.
- Clear README setup/deployment instructions.
- No fake reviews or fake urgency.
- No placeholder lorem ipsum.

## Completion behavior

Work through the implementation autonomously. Do not stop after scaffolding. Continue until all required pages and features compile successfully. At the end, report:

1. Files created/modified.
2. Features completed.
3. Environment variables required.
4. Client confirmations still needed before launch.
5. Exact commands to run locally and deploy.

---
