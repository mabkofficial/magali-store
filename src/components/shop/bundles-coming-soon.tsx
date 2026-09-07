import {
  draftBundleHighlights,
  featuredDraftBundles,
} from "@/config/draft-bundles";
import { cn } from "@/lib/utils";

export function BundlesComingSoon() {
  return (
    <section className="border-b border-border pb-8" aria-labelledby="bundles-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-botanical">Coming soon</p>
          <h2 id="bundles-heading" className="mt-1 font-display text-2xl text-ink">
            Curated bundles
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Mixed-product sets with bundle pricing — names and offers are being
            finalized. Cards below preview the planned lineup.
          </p>
        </div>
      </div>

      <ul className="grid min-w-0 grid-cols-2 grid-gap sm:grid-cols-3 lg:grid-cols-5">
        {featuredDraftBundles.map((bundle) => (
          <li
            key={bundle.id}
            className="flex min-w-0 flex-col border border-dashed border-border bg-surface-muted p-3 sm:p-4"
          >
            {bundle.highlight && (
              <span className="text-[10px] uppercase tracking-[0.1em] text-gold-touch">
                {draftBundleHighlights[bundle.highlight]}
              </span>
            )}
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink">
              {bundle.name}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">
              {bundle.tagline}
            </p>
            <span
              className={cn(
                "mt-auto pt-3 text-[10px] uppercase tracking-[0.1em] text-muted",
              )}
            >
              Coming soon
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
