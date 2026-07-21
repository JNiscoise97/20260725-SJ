import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { addDays, format } from "date-fns"

import { settingsService, SETTINGS_DEFAULTS, type AppSettings, type EventType } from "@/services/settings.service"
import { getDaysUntilEvent, getEventPhase, EVENT_PHASES, type EventPhase } from "@/lib/date"

export interface PhaseRange {
  startIso: string       // yyyy-MM-dd
  endIso?: string        // absent = dure 1 jour
  time?: string          // HH:mm — heure de début
  endTime?: string       // HH:mm — heure de fin (sur la date de fin, ou de début si pas de fin)
  isOverride: boolean
}

interface EventConfigValue {
  eventName: string
  eventDate: Date
  eventType: EventType
  phase: EventPhase
  daysUntilEvent: number
  isDayOf: boolean
  phaseMain: PhaseRange
  phaseSetup: PhaseRange
  phaseCleanup: PhaseRange
  isLoading: boolean
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
}

const EventConfigContext = createContext<EventConfigValue | null>(null)

function readPhaseOverride(): EventPhase | null {
  const value = new URLSearchParams(window.location.search).get("simulatePhase")
  return EVENT_PHASES.includes(value as EventPhase) ? (value as EventPhase) : null
}

function deriveValue(settings: AppSettings, isLoading: boolean, updateSettings: EventConfigValue["updateSettings"]): EventConfigValue {
  const eventDate = new Date(`${settings.eventDate}T00:00:00`)
  const now = new Date()
  const phase = readPhaseOverride() ?? getEventPhase(now, eventDate)

  const setupStart = settings.setupStart
    ? new Date(`${settings.setupStart}T00:00:00`)
    : addDays(eventDate, -1)
  const cleanupStart = settings.cleanupStart
    ? new Date(`${settings.cleanupStart}T00:00:00`)
    : addDays(eventDate, 1)

  return {
    eventName: settings.eventName,
    eventDate,
    eventType: settings.eventType,
    phase,
    daysUntilEvent: getDaysUntilEvent(now, eventDate),
    isDayOf: phase !== "prep",
    phaseMain: {
      startIso: settings.eventDate,
      endIso: settings.mainEnd,
      time: settings.mainTime,
      endTime: settings.mainEndTime,
      isOverride: false,
    },
    phaseSetup: {
      startIso: format(setupStart, "yyyy-MM-dd"),
      endIso: settings.setupEnd,
      time: settings.setupTime,
      endTime: settings.setupEndTime,
      isOverride: !!settings.setupStart,
    },
    phaseCleanup: {
      startIso: format(cleanupStart, "yyyy-MM-dd"),
      endIso: settings.cleanupEnd,
      time: settings.cleanupTime,
      endTime: settings.cleanupEndTime,
      isOverride: !!settings.cleanupStart,
    },
    isLoading,
    updateSettings,
  }
}

export function EventConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(SETTINGS_DEFAULTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    settingsService.get().then((s) => {
      setSettings(s)
      setIsLoading(false)
    })
  }, [])

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const updated = await settingsService.update(patch)
    setSettings(updated)
  }, [])

  const value = useMemo(
    () => deriveValue(settings, isLoading, updateSettings),
    [settings, isLoading, updateSettings]
  )

  return <EventConfigContext.Provider value={value}>{children}</EventConfigContext.Provider>
}

export function useEventConfig() {
  const ctx = useContext(EventConfigContext)
  if (!ctx) throw new Error("useEventConfig doit être utilisé dans EventConfigProvider")
  return ctx
}
