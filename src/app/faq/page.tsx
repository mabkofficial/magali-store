import { AccordionItem } from "@/components/ui/accordion";
import { PageContainer } from "@/components/layout/page-container";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Magali products, orders, and shipping.",
};

const faqSections = [
  {
    title: "Orders and shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Processing and delivery times depend on your location and the items in your order. Standard products ship through our regular fulfillment process. Frozen items may require separate arrangements. Contact us if you need help with a specific order.",
      },
      {
        q: "Can I order frozen beef pies online?",
        a: "Frozen items may require special shipping. If online checkout is unavailable for beef pies, use the contact form and our team will help you place your order.",
      },
      {
        q: "How do I track my order?",
        a: "You will receive order confirmation by email after checkout. Tracking details are sent when your order ships.",
      },
    ],
  },
  {
    title: "Hair Oil",
    items: [
      {
        q: "How often should I use Magali Botanical Hair Oil?",
        a: "Use 3 to 4 times per week for best results. Apply a small amount to the scalp and hair, massage for 3 to 5 minutes, and leave in or wash out with shampoo.",
      },
      {
        q: "Is it suitable for all hair types?",
        a: "Yes. Magali Botanical Hair Oil is formulated for all hair textures, including natural, color-treated, and chemically processed hair.",
      },
      {
        q: "Can I leave it in my hair?",
        a: "Yes. You can leave it in as a daily treatment or wash out with shampoo if you prefer.",
      },
    ],
  },
  {
    title: "Hair Grease",
    items: [
      {
        q: "How often should I use the hair grease?",
        a: "Use 1 to 3 times a week. Apply a small amount evenly to the scalp and hair, then massage gently with your fingertips.",
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
        a: "Dispense a few drops onto clean fingertips or a cotton swab and apply to the external target area. Use 2 to 3 times daily or as needed.",
      },
      {
        q: "What are the ingredients?",
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
        a: "Each pack contains 8 Caribbean-style beef pies, 32 oz / 2 lbs total.",
      },
      {
        q: "Do I cook them from frozen?",
        a: "Yes. Keep frozen until ready to cook. Do not thaw before cooking.",
      },
      {
        q: "Can I use an air fryer?",
        a: "Yes. Preheat to 350°F (175°C), cook in a single layer for 15 to 18 minutes, flipping halfway through.",
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
    <PageContainer narrow pageY>
      <p className="eyebrow text-muted">FAQ</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-sm text-muted">
        Quick answers about our products, orders, and shipping.
      </p>

      {faqSections.map((section) => (
        <section key={section.title} className="mt-8 border-t border-border pt-8">
          <h2 className="eyebrow mb-4 text-ink">{section.title}</h2>
          {section.items.map((item) => (
            <AccordionItem key={item.q} title={item.q}>
              <p>{item.a}</p>
            </AccordionItem>
          ))}
        </section>
      ))}
    </PageContainer>
  );
}
