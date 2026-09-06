export type HairType =
  | "curly-wavy"
  | "coily-kinky"
  | "fine-thin"
  | "color-treated"
  | "wellness-only";

export type PrimaryConcern =
  | "dryness"
  | "breakage"
  | "scalp"
  | "wellness"
  | "frizz";

export type CarePreference =
  | "oil-treatment"
  | "seal-style"
  | "full-routine"
  | "wellness-only";

export type FoodInterest = "yes" | "no";

export type QuizAnswers = {
  hairType: HairType;
  concern: PrimaryConcern;
  carePreference: CarePreference;
  foodInterest: FoodInterest;
};

export type QuizQuestionOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

export type QuizQuestion<T extends string = string> = {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizQuestionOption<T>[];
};

export const QUIZ_QUESTIONS = {
  hairType: {
    id: "hairType",
    title: "What's your hair type?",
    subtitle: "Choose the option that best describes your hair.",
    options: [
      { value: "curly-wavy", label: "Curly or wavy" },
      { value: "coily-kinky", label: "Coily or kinky" },
      { value: "fine-thin", label: "Fine or thin" },
      { value: "color-treated", label: "Color-treated or chemically processed" },
      {
        value: "wellness-only",
        label: "Not applicable — I'm here for wellness",
      },
    ],
  } satisfies QuizQuestion<HairType>,
  concern: {
    id: "concern",
    title: "What's your primary concern?",
    subtitle: "We'll prioritize products that address this first.",
    options: [
      { value: "dryness", label: "Dryness & moisture" },
      { value: "breakage", label: "Breakage & strength" },
      { value: "scalp", label: "Scalp care" },
      { value: "wellness", label: "Muscle & joint comfort" },
      { value: "frizz", label: "Frizz & styling" },
    ],
  } satisfies QuizQuestion<PrimaryConcern>,
  carePreference: {
    id: "carePreference",
    title: "How do you prefer to care for your hair?",
    subtitle: "Pick the approach that fits your routine.",
    options: [
      { value: "oil-treatment", label: "Daily oil treatment" },
      { value: "seal-style", label: "Seal with grease or styling product" },
      { value: "full-routine", label: "Both — a complete routine" },
      {
        value: "wellness-only",
        label: "I'm here for wellness, not hair care",
      },
    ],
  } satisfies QuizQuestion<CarePreference>,
  foodInterest: {
    id: "foodInterest",
    title: "Interested in Caribbean food favorites?",
    subtitle: "Magali also offers family-size frozen favorites.",
    options: [
      { value: "no", label: "No, just hair & wellness" },
      { value: "yes", label: "Yes, show me food options too" },
    ],
  } satisfies QuizQuestion<FoodInterest>,
} as const;

export const QUIZ_STEP_ORDER = [
  "hairType",
  "concern",
  "carePreference",
  "foodInterest",
] as const;

export type QuizStepId = (typeof QUIZ_STEP_ORDER)[number];

export type RoutineRecommendation = {
  productIds: string[];
  headline: string;
  summary: string;
  qualifiesForBundleDiscount: boolean;
};

const PRODUCT_NAMES: Record<string, string> = {
  "hair-oil": "Botanical Hair Oil",
  "hair-grease": "Herbal Hair Grease",
  "pureheal-oil": "PureHeal Oil",
  "beef-pies": "Beef Pies",
};

function scoreProducts(answers: QuizAnswers): Map<string, number> {
  const scores = new Map<string, number>();

  const add = (id: string, points: number) => {
    scores.set(id, (scores.get(id) ?? 0) + points);
  };

  if (answers.hairType !== "wellness-only") {
    add("hair-oil", 2);
    if (answers.hairType === "coily-kinky" || answers.hairType === "curly-wavy") {
      add("hair-grease", 2);
    }
    if (answers.hairType === "color-treated" || answers.hairType === "fine-thin") {
      add("hair-oil", 2);
    }
  }

  switch (answers.concern) {
    case "dryness":
      add("hair-oil", 4);
      add("hair-grease", 3);
      break;
    case "breakage":
      add("hair-oil", 5);
      break;
    case "scalp":
      add("hair-oil", 5);
      break;
    case "wellness":
      add("pureheal-oil", 6);
      break;
    case "frizz":
      add("hair-grease", 4);
      add("hair-oil", 2);
      break;
  }

  switch (answers.carePreference) {
    case "oil-treatment":
      add("hair-oil", 4);
      break;
    case "seal-style":
      add("hair-grease", 4);
      break;
    case "full-routine":
      add("hair-oil", 3);
      add("hair-grease", 3);
      break;
    case "wellness-only":
      add("pureheal-oil", 5);
      scores.delete("hair-oil");
      scores.delete("hair-grease");
      break;
  }

  if (answers.concern === "wellness" || answers.carePreference === "wellness-only") {
    add("pureheal-oil", 3);
  }

  if (answers.foodInterest === "yes") {
    add("beef-pies", 2);
  }

  return scores;
}

function buildHeadline(productIds: string[]): string {
  if (productIds.includes("hair-oil") && productIds.includes("hair-grease")) {
    return "Your complete hair routine";
  }
  if (productIds.includes("pureheal-oil") && productIds.length === 1) {
    return "Your wellness essential";
  }
  if (productIds.includes("pureheal-oil") && productIds.includes("hair-oil")) {
    return "Wellness & nourishment";
  }
  if (productIds.length === 1) {
    const name = PRODUCT_NAMES[productIds[0]] ?? "Your match";
    return `Start with ${name}`;
  }
  return "Your personalized routine";
}

function buildSummary(productIds: string[], qualifiesForBundleDiscount: boolean): string {
  const names = productIds.map((id) => PRODUCT_NAMES[id] ?? id);

  if (names.length === 1) {
    return `${names[0]} is our top pick based on your answers.`;
  }

  const list =
    names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;

  const bundleNote = qualifiesForBundleDiscount
    ? " Add both hair care items together and save 10% at checkout."
    : "";

  return `${list} work well together for your goals.${bundleNote}`;
}

export function getRoutineRecommendation(answers: QuizAnswers): RoutineRecommendation {
  const scores = scoreProducts(answers);

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  let productIds: string[];

  if (answers.carePreference === "wellness-only" || answers.hairType === "wellness-only") {
    productIds = ranked.filter((id) => id === "pureheal-oil" || (answers.foodInterest === "yes" && id === "beef-pies"));
    if (productIds.length === 0) productIds = ["pureheal-oil"];
  } else if (answers.carePreference === "full-routine") {
    productIds = ["hair-oil", "hair-grease"];
    if (answers.concern === "wellness" || ranked.includes("pureheal-oil")) {
      productIds.push("pureheal-oil");
    }
  } else {
    productIds = ranked.slice(0, answers.concern === "wellness" ? 2 : 2);
    if (productIds.length === 0) productIds = ["hair-oil"];
  }

  if (answers.foodInterest === "yes" && !productIds.includes("beef-pies")) {
    productIds = [...productIds, "beef-pies"];
  }

  if (answers.foodInterest === "no") {
    productIds = productIds.filter((id) => id !== "beef-pies");
  }

  productIds = [...new Set(productIds)];

  const hairCareIds = productIds.filter((id) => id === "hair-oil" || id === "hair-grease");
  const qualifiesForBundleDiscount = hairCareIds.length >= 2;

  return {
    productIds,
    headline: buildHeadline(productIds),
    summary: buildSummary(productIds, qualifiesForBundleDiscount),
    qualifiesForBundleDiscount,
  };
}
