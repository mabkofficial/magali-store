import { RoutineQuiz, RoutineQuizShell } from "@/components/routine-quiz/routine-quiz";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "Find Your Routine",
  description:
    "Take our quick quiz to discover the Magali hair care and wellness products best suited to your needs.",
};

export default async function FindYourRoutinePage() {
  const products = await getAllProducts();

  return (
    <RoutineQuizShell>
      <RoutineQuiz products={products} />
    </RoutineQuizShell>
  );
}
