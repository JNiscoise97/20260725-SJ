import type { Identity } from "@/types/domain"

export function useDefaultLandingPath(identity: Identity | null) {
  if (!identity) return { path: "/", isLoading: false }
  return { path: "/", isLoading: false }
}
