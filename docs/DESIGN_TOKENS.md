# Design Tokens — Magali

## Spacing (4px / 8px grid)

Tailwind spacing uses a **4px base**. Layout surfaces use **8px multiples**; micro UI uses **4px multiples**.

### Semantic utilities

| Class | Tailwind equivalent | px | Use |
|-------|---------------------|-----|-----|
| `.page-y` | `py-12 sm:py-16` | 48 / 64 | Shop, cart, collection, quiz pages |
| `.section-y` | `py-12 sm:py-16 lg:py-20` | 48 / 64 / 80 | Homepage sections, footer |
| `.page-header` | `mb-8 pb-8` + border | 32 | Page title block below breadcrumbs |
| `.stack-sm` | `space-y-4` | 16 | Form fields, card content |
| `.stack-md` | `space-y-6` | 24 | Section sub-blocks |
| `.stack-lg` | `space-y-8` | 32 | Legal / long-form content |
| `.grid-gap` | `gap-4 sm:gap-6 lg:gap-8` | 16 / 24 / 32 | Product and category grids |

Defined in [`src/styles/spacing.css`](../src/styles/spacing.css).

### Rules

- **Macro layout** (sections, page padding, grids): 16, 24, 32, 48, 64, 80px only
- **Micro layout** (badges, labels, icon gaps): 4, 8, 12px
- Avoid: arbitrary px values, `gap-10`, `gap-14`, fractional steps (`*-2.5`, `*-3.5`) except 44px touch targets

### Page horizontal padding

[`PageContainer`](../src/components/layout/page-container.tsx): `px-4 sm:px-6 lg:px-8` (16 / 24 / 32px)
