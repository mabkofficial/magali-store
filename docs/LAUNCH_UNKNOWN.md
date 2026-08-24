# Magali Launch Unknowns

Items intentionally deferred until client confirmation. Update this file as values are confirmed — do not hard-code guesses across the site.

## Product Data

- [ ] **Hair Grease size:** Client said 8 oz; label says 185 g / 6.5 oz — currently using label value
- [ ] **PureHeal size:** Client says 2 oz; label shows 60 ml / 2.03 fl oz — currently using label value
- [ ] **Hair Oil naming:** Hair Oil / Hair Growth Oil / Botanical Hair Oil — confirm official name
- [ ] **Beef Pies naming:** pies vs patties/pasties — currently using "pies" in UI

## Compliance & Claims

- [ ] **PureHeal public claims:** Review final wording before full commercial launch (cold sores, oral, muscle/joint references in client materials)
- [ ] **Beef Pies allergen statement:** Artwork shows `CONTAINS: —` — needs confirmation
- [ ] **Label vs AI image QA:** Compare generated product images against `references/labels/` before commercial launch

## Operations

- [ ] Shipping regions and rates (standard + frozen)
- [ ] Tax rules
- [ ] Return/refund policies (legal review)
- [ ] Business contact info and social links
- [ ] Inventory counts
- [ ] Stripe live payment keys
- [ ] Newsletter provider

## Frozen Food

- [ ] Frozen shipping method and cost
- [ ] Enable checkout: set `FROZEN_CHECKOUT_ENABLED = true` in `src/config/site.ts` once ready

## Not Required for Trademark Filing

The following can remain pending during trademark registration launch:

- Final allergen statements
- Frozen shipping rates
- PureHeal compliance finalization
- Label vs AI image QA
- Live Stripe keys (test mode acceptable)
