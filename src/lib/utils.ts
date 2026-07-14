import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayName(fullName: string, nickname?: string | null): string {
  return nickname ? `${nickname} (${fullName})` : fullName
}
