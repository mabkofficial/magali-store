import { AccordionItem } from "@/components/ui/accordion";
import type { Product, ProductDirections } from "@/types/product";

interface ProductAccordionsProps {
  product: Product;
}

function renderDirections(directions: ProductDirections) {
  if (Array.isArray(directions)) {
    return (
      <ol className="list-decimal space-y-2 pl-5">
        {directions.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">Oven</h4>
        <p className="mt-1">{directions.oven}</p>
      </div>
      <div>
        <h4 className="font-medium">Air Fryer</h4>
        <p className="mt-1">{directions.airFryer}</p>
      </div>
      <div>
        <h4 className="font-medium">Skillet</h4>
        <p className="mt-1">{directions.skillet}</p>
      </div>
    </div>
  );
}

function renderIngredients(ingredients: Product["ingredients"]) {
  return (
    <div className="space-y-4">
      {Object.entries(ingredients).map(([group, items]) => (
        <div key={group}>
          <h4 className="font-medium capitalize">
            {group.replace(/([A-Z])/g, " $1").trim()}
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ProductAccordions({ product }: ProductAccordionsProps) {
  return (
    <div className="mt-12">
      <AccordionItem title="Overview" defaultOpen>
        <p>{product.overview}</p>
      </AccordionItem>
      <AccordionItem title="Benefits">
        <ul className="list-disc space-y-2 pl-5">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </AccordionItem>
      <AccordionItem title="Ingredients">
        {renderIngredients(product.ingredients)}
      </AccordionItem>
      {product.nutritionHighlights && (
        <AccordionItem title="Nutrition Highlights">
          <ul className="list-disc space-y-2 pl-5">
            {product.nutritionHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AccordionItem>
      )}
      <AccordionItem title={product.category === "Food" ? "Cooking Instructions" : "How to Use"}>
        {renderDirections(product.directions)}
      </AccordionItem>
      <AccordionItem title="Caution">
        <p>{product.caution}</p>
      </AccordionItem>
      <AccordionItem title="Storage">
        <p>{product.storage}</p>
      </AccordionItem>
    </div>
  );
}
