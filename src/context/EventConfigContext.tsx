import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import { settingsService } from "@/services/settings.service"
import { getDaysUntilEvent, getEventPhase, EVENT_PHASES, type EventPhase } from "@/lib/date"

interface EventConfigValue {
  eventName: string
  eventDate: Date
  phase: EventPhase
  daysUntilEvent: number
  isDayOf: boolean
  setEventDate: (isoDate: string) => void
}

const EventConfigContext = createContext<EventConfigValue | null>(null)

function readPhaseOverride(): EventPhase | null {
  const value = new URLSearchParams(window.location.search).get("simulatePhase")
  return EVENT_PHASES.includes(value as EventPhase) ? (value as EventPhase) : null
}

export function EventConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() => settingsService.get())

  const value = useMemo<EventConfigValue>(() => {
    const eventDate = new Date(`${settings.eventDate}T00:00:00`)
    const now = new Date()
    const phase = readPhaseOverride() ?? getEventPhase(now, eventDate)

    return {
      eventName: settings.eventName,
      eventDate,
      phase,
      daysUntilEvent: getDaysUntilEvent(now, eventDate),
      isDayOf: phase !== "prep",
      setEventDate: (isoDate: string) => setSettings(settingsService.update({ eventDate: isoDate })),
    }
  }, [settings])

  return <EventConfigContext.Provider value={value}>{children}</EventConfigContext.Provider>
}

export function useEventConfig() {
  const ctx = useContext(EventConfigContext)
  if (!ctx) throw new Error("useEventConfig doit être utilisé dans EventConfigProvider")
  return ctx
}
