/**
 * Shared, cross-feature React hooks. Existing hooks live under `@/hooks`
 * (e.g. `use-toast`, `use-mobile`); re-export them here as the shared surface so
 * feature code can import from a single, stable location.
 */
export { useToast, toast } from "@/hooks/use-toast";
export { useIsMobile } from "@/hooks/use-mobile";
