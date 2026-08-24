# Magali Design System

Editorial minimal ecommerce — monochromatic, photography-led, print-inspired.

## Philosophy

The interface recedes. Product photography and typography carry the brand. No decorative chrome, no chromatic accents, no elevation shadows. Think gallery wall, not software dashboard.

Reference tone: SSENSE, Zara, Adam Lippes — restrained black-on-white with hairline structure.

## Palette

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#000000` | Text, borders, filled buttons |
| `--muted` | `#6b6b6b` | Secondary text, meta labels |
| `--muted-light` | `#999999` | Tertiary, captions |
| `--border` | `#e5e5e5` | Hairline rules, input borders |
| `--surface` | `#ffffff` | Page, cards |
| `--surface-muted` | `#f7f7f7` | Alternate sections, image wells |

No gold, green, red, or navy in UI chrome. Color exists only in product photography.

## Typography

- **Display:** Newsreader — headlines, product names, wordmark moments
- **UI:** IBM Plex Sans — navigation, body, controls, prices

### Scale

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Eyebrow | 11px | 500 | Uppercase, `tracking-[0.14em]` |
| Body | 14px | 400 | `leading-relaxed` |
| Nav | 12px | 500 | Uppercase, tracked |
| Product title | 16–18px | 400 | Display font |
| Section headline | 32–48px | 400 | Display, tight leading |
| Price | 14px | 500 | Sans, not display |

## Layout

- Max content width: `1440px` (`max-w-[90rem]`)
- Section padding: `py-20 lg:py-28`
- Product grid: 2 col mobile → 4 col desktop, minimal gutters
- Hairline dividers between major blocks (`border-t border-border`)

## Radius & shadow

- **Radius:** `0` everywhere. Sharp edges only.
- **Shadow:** None. Separation via whitespace and 1px borders.

## Components

- **Primary button:** Black fill, white text, uppercase 12px tracked
- **Secondary button:** 1px black outline, ghost fill
- **Product tile:** Image on `#f7f7f7` well, metadata below with hairline top
- **Header:** Fixed white bar, hairline bottom, uppercase nav
- **Inputs:** 1px border, no fill, square corners

## Motion

- Duration: 150ms UI, 250ms drawers
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)`
- Never `transition-all`
- Hover effects gated behind `@media (hover: hover) and (pointer: fine)`
- Image crossfade on product cards (desktop only)

## Anti-patterns (avoid)

- Blur orbs, gradient washes, floating thumbnail collages
- Rounded-2xl cards with drop shadows
- Colored category lanes (green/gold/red/navy)
- Icon circles for trust badges
- Centered h2 + subtitle on every section
- Inter, Manrope, Cormorant Garamond (generic AI pairing)
- "Quick Add" pill buttons on every card
- Decorative lucide icons in marketing sections
