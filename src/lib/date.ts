import { differenceInCalendarDays } from "date-fns"

export type EventPhase = "prep" | "j-1" | "jour-j" | "j+1" | "post"

export const EVENT_PHASES: EventPhase[] = ["prep", "j-1", "jour-j", "j+1", "post"]

export function getDaysUntilEvent(now: Date, eventDate: Date): number {
  return differenceInCalendarDays(eventDate, now)
}

export function getEventPhase(now: Date, eventDate: Date): EventPhase {
  const daysUntilEvent = getDaysUntilEvent(now, eventDate)
  if (daysUntilEvent > 1) return "prep"
  if (daysUntilEvent === 1) return "j-1"
  if (daysUntilEvent === 0) return "jour-j"
  if (daysUntilEvent === -1) return "j+1"
  return "post"
}
