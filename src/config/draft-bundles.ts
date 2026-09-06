/**
 * Draft bundle catalog — pricing and selection not yet finalized with client.
 * Used for coming-soon UI only until bundles are published as products.
 */
export type DraftBundle = {
  id: string;
  name: string;
  tagline: string;
  /** Client recommendation tier for future merchandising. */
  highlight?: "entry" | "best-seller" | "best-value" | "premium";
  published: false;
};

/** Bundles recommended for homepage/shop feature once finalized. */
export const featuredDraftBundles: DraftBundle[] = [
  {
    id: "botanical-duo",
    name: "Magali Botanical Duo",
    tagline: "Hair oil + PureHeal — entry-level pair",
    highlight: "entry",
    published: false,
  },
  {
    id: "complete-care",
    name: "Complete Care Bundle",
    tagline: "Multi-unit hair oil + PureHeal",
    published: false,
  },
  {
    id: "family-care",
    name: "Family Care Bundle",
    tagline: "Stock up for the whole household",
    highlight: "best-seller",
    published: false,
  },
  {
    id: "premium-care",
    name: "Premium Care Bundle",
    tagline: "Higher-volume hair + wellness set",
    highlight: "premium",
    published: false,
  },
  {
    id: "ultimate-botanical",
    name: "Ultimate Botanical Bundle",
    tagline: "Maximum value multi-product set",
    highlight: "best-value",
    published: false,
  },
];

export const draftBundleHighlights: Record<
  NonNullable<DraftBundle["highlight"]>,
  string
> = {
  entry: "Entry pick",
  "best-seller": "Best seller",
  "best-value": "Best value",
  premium: "Premium",
};
