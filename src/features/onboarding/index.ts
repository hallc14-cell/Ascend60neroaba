/**
 * Onboarding feature (Phase 2).
 *
 * First-run flow: a welcome screen followed by the recovery-track / protocol
 * selector. On confirmation it seeds the local progress store + user profile
 * with the chosen program and routes to the dashboard.
 */
import { loadLocal } from "@/features/checklist/services/progressRepository";

export { OnboardingFlow } from "./OnboardingFlow";
export { ProtocolSelector } from "./ProtocolSelector";

/**
 * Whether the user has already picked a program. New users have neither a
 * protocolId nor a startDate in their local store and should be routed through
 * onboarding first. Existing users (who have started a program) skip it.
 */
export function hasCompletedOnboarding(): boolean {
  try {
    const store = loadLocal();
    return Boolean(store.protocolId || store.startDate);
  } catch {
    return false;
  }
}
