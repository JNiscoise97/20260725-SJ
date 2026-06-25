import { EVENT_DATE, EVENT_NAME } from "@/lib/constants"

const SETTINGS_KEY = "sj-app-settings"

export interface AppSettings {
  eventName: string
  eventDate: string
}

// Lecture/écriture synchrone volontairement : ce singleton n'est stocké que dans
// localStorage et lu une fois au montage de EventConfigProvider. Contrairement aux
// autres services (tasks, people...), il n'y a pas de bascule Supabase prévue ici
// dans l'immédiat ; le jour où app_settings sera lu depuis Supabase, ce service
// devra devenir asynchrone comme les autres.
function readSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (raw) return JSON.parse(raw) as AppSettings
  return { eventName: EVENT_NAME, eventDate: EVENT_DATE }
}

function writeSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const settingsService = {
  get: readSettings,
  update(patch: Partial<AppSettings>): AppSettings {
    const next = { ...readSettings(), ...patch }
    writeSettings(next)
    return next
  },
}
