/**
 * Registry of available 60-day protocols.
 *
 * Phase 1 ships only the default "Looksmax" program. Phase 2 will register
 * additional addiction-type programs here — the rest of the app never needs to
 * change because everything reads protocols through the loader.
 */
import type {
  AddictionType,
  ProtocolDefinition,
  ProtocolSummary,
} from "@/types/protocol";
import { looksmaxProtocol } from "./protocols/looksmax";

/** All registered protocols keyed by id. */
const REGISTRY: Record<string, ProtocolDefinition> = {
  [looksmaxProtocol.id]: looksmaxProtocol,
};

export const DEFAULT_PROTOCOL_ID = looksmaxProtocol.id;

export function getProtocolById(id: string): ProtocolDefinition | undefined {
  return REGISTRY[id];
}

export function listProtocols(): ProtocolSummary[] {
  return Object.values(REGISTRY).map((p) => ({
    id: p.id,
    addictionType: p.addictionType,
    name: p.name,
    tagline: p.tagline,
    durationDays: p.durationDays,
  }));
}

/** Find the protocol that targets a given addiction type (first match). */
export function getProtocolByAddiction(
  type: AddictionType | string
): ProtocolDefinition | undefined {
  return Object.values(REGISTRY).find((p) => p.addictionType === type);
}

export { REGISTRY as PROTOCOL_REGISTRY };
