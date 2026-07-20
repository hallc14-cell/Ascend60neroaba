/**
 * Cross-feature utility helpers. `cn` (the Tailwind class merger used across the
 * UI) currently lives at `@/lib/utils`; re-export it here so new feature code can
 * depend on the shared layer instead of reaching into `lib`.
 */
export { cn } from "@/lib/utils";
