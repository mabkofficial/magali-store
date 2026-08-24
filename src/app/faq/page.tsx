import { AccordionItem } from "@/components/ui/accordion";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Magali products.",
};

const faqSections = [
  {
    title: "Hair Oil",
    items: [
      {
        q: "How often should I use Magali Botanical Hair Oil?",
        a: "Use 3–4 times per week for best results. Apply a small amount to the scalp and hair, massage for 3–5 minutes, and leave in or wash out with shampoo.",
      },
      {
        q: "Is it suitable for all hair types?",
        a: "Yes. Magali Botanical Hair Oil is formulated for all hair textures, including natural, color-treated, and chemically processed hair.",
      },
      {
        q: "Can I leave it in my hair?",
        a: "Yes. You can leave it in as a daily treatment or wash out with shampoo if preferred.",
      },
    ],
  },
  {
    title: "Hair Grease",
    items: [
      {
        q: "How often should I use the hair grease?",
        a: "Use 1–3 times a week. Apply a small amount evenly to scalp and hair and massage gently with fingertips.",
      },
      {
        q: "Is it suitable for all hair types?",
        a: "Yes. Magali Herbal Hair Grease is designed for all hair types.",
      },
    ],
  },
  {
    title: "PureHeal Oil",
    items: [
      {
        q: "How do I apply PureHeal Oil?",
        a: "Dispense a few drops onto clean fingertips or a cotton swab and apply directly to the external target area. Use 2–3 times daily or as needed.",
      },
      {
        q: "What are its ingredients?",
        a: "PureHeal Oil contains cold-pressed castor oil and pure clove essential oil.",
      },
      {
        q: "Is it for external use only?",
        a: "Yes. PureHeal Oil is for external use only. Avoid direct contact with eyes and discontinue use if irritation occurs.",
      },
    ],
  },
  {
    title: "Beef Pies",
    items: [
      {
        q: "How many pies are in a pack?",
        a: "Each pack contains 8 Caribbean-style beef pies (32 oz / 2 lbs total).",
      },
      {
        q: "Do I cook them from frozen?",
        a: "Yes. Keep frozen until ready to cook. Do not thaw before cooking.",
      },
      {
        q: "Can I use an air fryer?",
        a: "Yes. Preheat to 350°F (175°C), cook in a single layer for 15–18 minutes, flipping halfway through.",
      },
      {
        q: "What internal temperature should they reach?",
        a: "Always ensure pies reach an internal temperature of 160°F (71°C) before serving.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Frequently Asked Questions
      </h1>
      <p className="mt-4 text-magali-ink/60">
        Answers based on current product information. Shipping and return
        policies will be added once confirmed.
      </p>

      {faqSections.map((section) => (
        <section key={section.title} className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-magali-green-950">
            {section.title}
          </h2>
          {section.items.map((item) => (
            <AccordionItem key={item.q} title={item.q}>
              <p>{item.a}</p>
            </AccordionItem>
          ))}
        </section>
      ))}
    </div>
  );
}
