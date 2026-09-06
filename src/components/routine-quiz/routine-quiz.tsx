"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { EmailSignup } from "@/components/home/email-signup";
import { Button } from "@/components/ui/button";
import { FBT_BUNDLE_DISCOUNT_PERCENT } from "@/lib/fbt-config";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import {
  getRoutineRecommendation,
  QUIZ_QUESTIONS,
  QUIZ_STEP_ORDER,
  type QuizAnswers,
  type QuizStepId,
} from "@/lib/routine-quiz";
import { useAddMultipleToCart } from "@/hooks/use-cart-ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface RoutineQuizProps {
  products: Product[];
}

const INITIAL_ANSWERS: Partial<QuizAnswers> = {};

export function RoutineQuiz({ products }: RoutineQuizProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(INITIAL_ANSWERS);
  const [showResults, setShowResults] = useState(false);
  const addMultiple = useAddMultipleToCart("pdp");
  const formId = useId();

  const currentStepId = QUIZ_STEP_ORDER[stepIndex];
  const currentQuestion = QUIZ_QUESTIONS[currentStepId];
  const currentAnswer = answers[currentStepId];
  const isLastStep = stepIndex === QUIZ_STEP_ORDER.length - 1;

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const recommendation = useMemo(() => {
    if (!showResults) return null;
    const complete = answers as QuizAnswers;
    return getRoutineRecommendation(complete);
  }, [answers, showResults]);

  const recommendedProducts = useMemo(() => {
    if (!recommendation) return [];
    return recommendation.productIds
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
  }, [recommendation, productMap]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentStepId]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (isLastStep) {
      setShowResults(true);
      return;
    }

    setStepIndex((index) => index + 1);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
    }
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
    setStepIndex(0);
    setShowResults(false);
  };

  const handleAddRoutine = useCallback(() => {
    if (recommendedProducts.length === 0) return;

    const applyDiscount = recommendation?.qualifiesForBundleDiscount ?? false;
    addMultiple(recommendedProducts, undefined, { applyFbtDiscount: applyDiscount });
  }, [addMultiple, recommendedProducts, recommendation]);

  if (showResults && recommendation) {
    return (
      <div className="space-y-10">
        <div className="border border-border bg-surface-muted p-6 sm:p-8">
          <p className="eyebrow text-botanical">Your results</p>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
            {recommendation.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {recommendation.summary}
          </p>
          {recommendation.qualifiesForBundleDiscount && (
            <p className="mt-3 text-sm font-medium text-botanical">
              Save {FBT_BUNDLE_DISCOUNT_PERCENT}% when you add this hair care routine
              together at checkout.
            </p>
          )}
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {recommendedProducts.map((product) => (
            <li
              key={product.id}
              className="flex gap-4 border border-border bg-surface p-4 sm:p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-border bg-surface-muted">
                <Image
                  src={getPrimaryImageUrl(product.images)}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-display text-base text-ink hover:text-botanical"
                >
                  {product.shortName}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {product.tagline}
                </p>
                <p className="mt-2 text-sm font-medium text-ink">
                  {formatUSD(product.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" onClick={handleAddRoutine}>
            Add routine to cart
          </Button>
          <Button type="button" variant="outline" onClick={handleRestart}>
            Retake quiz
          </Button>
        </div>

        <div className="border-t border-border pt-10">
          <EmailSignup
            source="routine-quiz"
            showIncentive
            variant="light"
          />
        </div>
      </div>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        event.preventDefault();
        handleNext();
      }}
      className="space-y-8"
    >
      <div className="flex items-center gap-2" aria-hidden>
        {QUIZ_STEP_ORDER.map((stepId, index) => (
          <span
            key={stepId}
            className={cn(
              "h-1 flex-1 transition-colors",
              index <= stepIndex ? "bg-botanical" : "bg-border",
            )}
          />
        ))}
      </div>

      <p className="text-xs uppercase tracking-[0.1em] text-muted">
        Question {stepIndex + 1} of {QUIZ_STEP_ORDER.length}
      </p>

      <fieldset>
        <legend className="font-display text-2xl text-ink sm:text-3xl">
          {currentQuestion.title}
        </legend>
        {currentQuestion.subtitle && (
          <p className="mt-3 text-sm text-muted">{currentQuestion.subtitle}</p>
        )}

        <div
          className="mt-8 space-y-3"
          role="radiogroup"
          aria-labelledby={`${formId}-legend`}
        >
          {currentQuestion.options.map((option) => {
            const selected = currentAnswer === option.value;
            const inputId = `${formId}-${currentStepId}-${option.value}`;
            const description =
              "description" in option &&
              typeof option.description === "string"
                ? option.description
                : undefined;

            return (
              <label
                key={option.value}
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
                  selected
                    ? "border-botanical bg-surface-muted"
                    : "border-border bg-surface hover:border-muted-light",
                )}
              >
                <input
                  type="radio"
                  id={inputId}
                  name={currentStepId}
                  value={option.value}
                  checked={selected}
                  onChange={() => handleSelect(option.value)}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--botanical)]"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">
                    {option.label}
                  </span>
                  {description ? (
                    <span className="mt-1 block text-xs text-muted">
                      {description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={stepIndex === 0 && !showResults}
        >
          Back
        </Button>
        <Button type="submit" disabled={!currentAnswer}>
          {isLastStep ? "See my routine" : "Continue"}
        </Button>
      </div>
    </form>
  );
}

export function RoutineQuizShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-botanical">Find your routine</p>
        <h1 className="mt-3 font-display text-4xl text-ink lg:text-5xl">
          Not sure where to start?
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Answer a few quick questions and we&apos;ll recommend Magali products
          tailored to your hair type, concerns, and preferences.
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </PageContainer>
  );
}
