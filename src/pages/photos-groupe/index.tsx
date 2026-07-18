import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle, ArrowLeft, Camera, Check, CheckCircle2,
  ChevronDown, ChevronRight, Clock, LogOut, Pencil, SkipForward, Star,
} from "lucide-react"
import { toast } from "sonner"

import type { Guest, GuestGroup, Person, PhotoGroup, PhotoGroupMember, PhotoSession } from "@/types/domain"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { estimatePhotoDurationSeconds, formatDuration, recordPhotoDuration } from "@/lib/photo-duration"
import { useGuests, useGuestGroups } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import {
  useAllPhotoGroupMembers,
  usePhotoGroups,
  useUpdatePhotoGroup,
  useUpdatePhotoGroupMember,
} from "@/hooks/queries/use-photo-groups"
import { usePhotoSessions } from "@/hooks/queries/use-photo-sessions"

// ── Types & helpers ──────────────────────────────────────────────────────────

type Screen = "sessions" | "gathering" | "shooting"
type PresenceStatus = "present" | "en_route" | "absent"

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function cyclePresence(s: PresenceStatus): PresenceStatus {
  return s === "present" ? "en_route" : s === "en_route" ? "absent" : "present"
}

const PRESENCE_CLASS: Record<PresenceStatus, string> = {
  present: "bg-vert-vegetal/15 text-vert-vegetal border-vert-vegetal/30",
  en_route: "bg-dore/20 text-brun border-dore/40",
  absent: "bg-bordeaux/15 text-bordeaux border-bordeaux/30",
}

// ── SessionListScreen ────────────────────────────────────────────────────────

function SessionListScreen({ sessions, groups, onEnter }: {
  sessions: PhotoSession[]
  groups: PhotoGroup[]
  onEnter: (id: string) => void
}) {
  const sorted = [...sessions].sort((a, b) => a.sortOrder - b.sortOrder)

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
        <Camera className="size-8 opacity-30" />
        <p className="text-sm">Aucune séance photo configurée.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((session) => {
        const sg = groups.filter(g => g.sessionId === session.id)
        const done = sg.filter(g => g.status === "done").length
        const skipped = sg.filter(g => g.status === "skipped").length
        const remaining = sg.filter(g => g.status === "pending").length
        const total = sg.length
        const isComplete = total > 0 && remaining === 0
        const isStarted = (done + skipped) > 0 && !isComplete

        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onEnter(session.id)}
            className={cn(
              "w-full text-left rounded-xl border px-4 py-3 space-y-2 transition-colors hover:bg-muted/50",
              isComplete ? "border-vert-vegetal/30 bg-vert-vegetal/5" : "border-border bg-card"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{session.label}</p>
                <p className="text-sm text-muted-foreground">
                  {isComplete ? "Séance terminée"
                    : remaining > 0 ? `${remaining} restante${remaining > 1 ? "s" : ""}`
                    : "—"}
                  {done > 0 && ` · ${done} prise${done > 1 ? "s" : ""}`}
                  {skipped > 0 && ` · ${skipped} passée${skipped > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isComplete && <CheckCircle2 className="size-4 text-vert-vegetal" />}
                {isStarted && <Badge className="bg-dore/20 text-brun">En cours</Badge>}
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
            {total > 0 && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-vert-vegetal/60 transition-all"
                  style={{ width: `${Math.round(((done + skipped) / total) * 100)}%` }}
                />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── GatheringScreen ──────────────────────────────────────────────────────────

function GatheringScreen({ session, groups, members, guests, guestGroups, fiances, onStart, onBack }: {
  session: PhotoSession
  groups: PhotoGroup[]
  members: PhotoGroupMember[]
  guests: Guest[]
  guestGroups: GuestGroup[]
  fiances: Person[]
  onStart: () => void
  onBack: () => void
}) {
  const [presence, setPresence] = useState<Map<string, PresenceStatus>>(new Map())
  const updateGroup = useUpdatePhotoGroup()

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.sortOrder - b.sortOrder), [groups])
  const guestById = useMemo(() => new Map(guests.map(g => [g.id, g])), [guests])
  const membersByGroupId = useMemo(() => {
    const map = new Map<string, PhotoGroupMember[]>()
    for (const m of members) {
      const list = map.get(m.photoGroupId) ?? []
      list.push(m)
      map.set(m.photoGroupId, list)
    }
    return map
  }, [members])

  const fianceIdSet = useMemo(() => new Set(fiances.map(f => f.id)), [fiances])

  function toggle(id: string) {
    setPresence(prev => {
      const next = new Map(prev)
      next.set(id, cyclePresence(next.get(id) ?? "present"))
      return next
    })
  }

  const absentGuestIds = useMemo(() =>
    [...presence.entries()].filter(([id, s]) => s === "absent" && !fianceIdSet.has(id)).map(([id]) => id),
    [presence, fianceIdSet]
  )
  const absentFianceIds = useMemo(() =>
    [...presence.entries()].filter(([id, s]) => s === "absent" && fianceIdSet.has(id)).map(([id]) => id),
    [presence, fianceIdSet]
  )

  const impactedGroups = useMemo(() =>
    sortedGroups.filter(group => {
      if (group.status !== "pending") return false
      const gm = membersByGroupId.get(group.id) ?? []
      if (gm.some(m => absentGuestIds.includes(m.guestId))) return true
      const reqIds = group.requiredFianceIds.length > 0 ? group.requiredFianceIds : fiances.map(f => f.id)
      return absentFianceIds.some(id => reqIds.includes(id))
    }),
    [absentGuestIds, absentFianceIds, sortedGroups, membersByGroupId, fiances]
  )

  const totalAbsent = absentGuestIds.length + absentFianceIds.length

  async function skipImpacted() {
    await Promise.all(impactedGroups.map(g => updateGroup.mutateAsync({ id: g.id, patch: { status: "skipped" } })))
    toast.success(`${impactedGroups.length} groupe${impactedGroups.length > 1 ? "s" : ""} passé${impactedGroups.length > 1 ? "s" : ""}.`)
  }

  // Unique guest IDs across all photo groups in this session
  const sessionGuestIds = useMemo(() => {
    const ids = new Set<string>()
    for (const m of members) ids.add(m.guestId)
    return ids
  }, [members])

  // Unique fiancé IDs across all photo groups in this session
  const sessionFianceIds = useMemo(() => {
    const ids = new Set<string>()
    for (const group of sortedGroups) {
      const req = group.requiredFianceIds.length > 0 ? group.requiredFianceIds : fiances.map(f => f.id)
      req.forEach(id => ids.add(id))
    }
    return ids
  }, [sortedGroups, fiances])

  // Guests in session grouped by GuestGroup, then ungrouped at the end
  const guestsByGuestGroup = useMemo(() => {
    const sessionGuests = guests.filter(g => sessionGuestIds.has(g.id))
    const sortedGG = [...guestGroups].sort((a, b) => a.sortOrder - b.sortOrder)
    const rows: { label: string; guestIds: string[] }[] = []

    for (const gg of sortedGG) {
      const ids = sessionGuests.filter(g => g.groupId === gg.id).map(g => g.id)
      if (ids.length > 0) rows.push({ label: gg.familyName, guestIds: ids })
    }
    // Guests with no group
    const ungrouped = sessionGuests.filter(g => !g.groupId).map(g => g.id)
    if (ungrouped.length > 0) rows.push({ label: "Sans groupe", guestIds: ungrouped })

    return rows
  }, [guests, guestGroups, sessionGuestIds])

  const pendingCount = sortedGroups.filter(g => g.status === "pending").length
  const isStarted = sortedGroups.some(g => g.status !== "pending")
  const sessionFianceList = fiances.filter(f => sessionFianceIds.has(f.id))

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <button type="button" onClick={onBack} className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <p className="font-heading text-base font-semibold text-foreground">{session.label}</p>
          <p className="text-xs text-muted-foreground">Rassemblement · cliquez sur un nom pour changer son statut</p>
        </div>
      </div>

      {impactedGroups.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-bordeaux/30 bg-bordeaux/5 p-3">
          <AlertTriangle className="size-4 shrink-0 text-bordeaux mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-medium text-bordeaux">
              {totalAbsent} absent{totalAbsent > 1 ? "s" : ""} · {impactedGroups.length} groupe{impactedGroups.length > 1 ? "s" : ""} impacté{impactedGroups.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-bordeaux/70">{impactedGroups.map(g => g.label).join(", ")}</p>
            <Button
              size="sm" variant="outline"
              className="border-bordeaux/30 text-bordeaux hover:bg-bordeaux/10 hover:text-bordeaux"
              onClick={skipImpacted}
              disabled={updateGroup.isPending}
            >
              Passer ces groupes
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Fiancés — toujours en tête */}
        {sessionFianceList.length > 0 && (
          <div className="px-3 py-2.5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-bordeaux">Fiancés</p>
            <div className="flex flex-wrap gap-1.5">
              {sessionFianceList.map(f => {
                const status = presence.get(f.id) ?? "present"
                return (
                  <button key={f.id} type="button" onClick={() => toggle(f.id)}
                    className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors", PRESENCE_CLASS[status])}>
                    {f.fullName}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {/* Invités groupés par GuestGroup */}
        {guestsByGuestGroup.map(({ label, guestIds }) => (
          <div key={label} className="border-t border-border px-3 py-2.5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {guestIds.map(gid => {
                const g = guestById.get(gid)
                if (!g) return null
                const status = presence.get(gid) ?? "present"
                return (
                  <button key={gid} type="button" onClick={() => toggle(gid)}
                    className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors", PRESENCE_CLASS[status])}>
                    {g.fullName}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {pendingCount > 0 ? (
        <Button className="w-full" size="lg" onClick={onStart}>
          <Camera className="size-4" />
          {isStarted ? "Reprendre la séance" : "Lancer la séance"}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="size-8 text-vert-vegetal" />
          <p className="text-sm font-medium text-foreground">Séance terminée</p>
          <Button variant="outline" onClick={onBack}>Retour aux séances</Button>
        </div>
      )}
    </div>
  )
}

// ── ShootingScreen ───────────────────────────────────────────────────────────

function ShootingScreen({ session, groups, members, guests, fiances, onQuit }: {
  session: PhotoSession
  groups: PhotoGroup[]
  members: PhotoGroupMember[]
  guests: Guest[]
  fiances: Person[]
  onQuit: () => void
}) {
  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.sortOrder - b.sortOrder), [groups])
  const pendingGroups = useMemo(() => sortedGroups.filter(g => g.status === "pending"), [sortedGroups])

  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => pendingGroups[0]?.id ?? null)
  const [groupStartTime, setGroupStartTime] = useState<number>(() => Date.now())
  const [elapsedByGroupId, setElapsedByGroupId] = useState<Map<string, number>>(new Map())
  const [now, setNow] = useState(() => Date.now())
  const [noteValue, setNoteValue] = useState("")
  const [showUpcoming, setShowUpcoming] = useState(false)
  const [freedNames, setFreedNames] = useState<string[] | null>(null)
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateGroup = useUpdatePhotoGroup()
  const updateMember = useUpdatePhotoGroupMember()

  const guestById = useMemo(() => new Map(guests.map(g => [g.id, g])), [guests])
  const membersByGroupId = useMemo(() => {
    const map = new Map<string, PhotoGroupMember[]>()
    for (const m of members) {
      const list = map.get(m.photoGroupId) ?? []
      list.push(m)
      map.set(m.photoGroupId, list)
    }
    return map
  }, [members])

  const activeGroup = sortedGroups.find(g => g.id === activeGroupId) ?? null

  // Reset chrono + note when group changes
  useEffect(() => {
    setNoteValue(activeGroup?.notes ?? "")
    setGroupStartTime(Date.now())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroupId])

  // Auto-select first pending if current is gone
  useEffect(() => {
    if (!activeGroupId && pendingGroups.length > 0) {
      setActiveGroupId(pendingGroups[0].id)
    }
  }, [activeGroupId, pendingGroups])

  // 1-second tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Cleanup note debounce on unmount
  useEffect(() => () => { if (noteTimer.current) clearTimeout(noteTimer.current) }, [])

  function handleNoteChange(value: string) {
    setNoteValue(value)
    if (!activeGroupId) return
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => {
      updateGroup.mutate({ id: activeGroupId, patch: { notes: value.trim() || null } })
    }, 800)
  }

  // Chrono
  const groupElapsedMs = now - groupStartTime

  const sessionEstimatedSeconds = useMemo(() =>
    sortedGroups.reduce((sum, g) => {
      const rf = g.requiredFianceIds.length > 0 ? fiances.filter(f => g.requiredFianceIds.includes(f.id)) : fiances
      return sum + estimatePhotoDurationSeconds((membersByGroupId.get(g.id) ?? []).length + rf.length, g.label)
    }, 0),
    [sortedGroups, fiances, membersByGroupId]
  )

  const sessionActualMs = [...elapsedByGroupId.values()].reduce((s, v) => s + v, 0)
    + (activeGroupId ? groupElapsedMs : 0)

  const reqFiances = activeGroup
    ? (activeGroup.requiredFianceIds.length > 0 ? fiances.filter(f => activeGroup.requiredFianceIds.includes(f.id)) : fiances)
    : []
  const activeMembers = activeGroupId ? (membersByGroupId.get(activeGroupId) ?? []) : []
  const activeEstimatedSeconds = activeGroup
    ? estimatePhotoDurationSeconds(activeMembers.length + reqFiances.length, activeGroup.label)
    : 0

  const timeStatus = sessionActualMs / 1000 > sessionEstimatedSeconds ? "over"
    : sessionActualMs / 1000 > sessionEstimatedSeconds * 0.85 ? "warn"
    : "ok"

  async function handlePhotoPrise() {
    if (!activeGroupId || !activeGroup) return
    const elapsed = Date.now() - groupStartTime
    recordPhotoDuration(elapsed / 1000)
    setElapsedByGroupId(prev => new Map(prev).set(activeGroupId, elapsed))

    // Compute freed people: in this group but not in any remaining pending group
    const afterPending = pendingGroups.filter(g => g.id !== activeGroupId)
    const freed: string[] = []
    const groupMembers = membersByGroupId.get(activeGroupId) ?? []
    for (const m of groupMembers) {
      const stillNeeded = afterPending.some(g =>
        (membersByGroupId.get(g.id) ?? []).some(gm => gm.guestId === m.guestId)
      )
      if (!stillNeeded) {
        const guest = guestById.get(m.guestId)
        if (guest) freed.push(guest.fullName)
      }
    }
    const completedFianceIds = activeGroup.requiredFianceIds.length > 0
      ? activeGroup.requiredFianceIds
      : fiances.map(f => f.id)
    for (const fid of completedFianceIds) {
      const stillNeeded = afterPending.some(g => {
        const req = g.requiredFianceIds.length > 0 ? g.requiredFianceIds : fiances.map(f => f.id)
        return req.includes(fid)
      })
      if (!stillNeeded) {
        const fiance = fiances.find(f => f.id === fid)
        if (fiance) freed.push(fiance.fullName)
      }
    }

    await updateGroup.mutateAsync({ id: activeGroupId, patch: { status: "done" } })
    const next = pendingGroups.find(g => g.id !== activeGroupId)
    setActiveGroupId(next?.id ?? null)
    if (freed.length > 0) setFreedNames(freed)
  }

  async function handlePasser() {
    if (!activeGroupId) return
    await updateGroup.mutateAsync({ id: activeGroupId, patch: { status: "skipped" } })
    const next = pendingGroups.find(g => g.id !== activeGroupId)
    setActiveGroupId(next?.id ?? null)
  }

  const doneGroups = sortedGroups.filter(g => g.status === "done")
  const skippedGroups = sortedGroups.filter(g => g.status === "skipped")

  // ── Recap ────────────────────────────────────────────────────────────────

  if (sortedGroups.length > 0 && pendingGroups.length === 0) {
    const totalActual = [...elapsedByGroupId.values()].reduce((s, v) => s + v, 0) / 1000
    const delta = totalActual - sessionEstimatedSeconds

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onQuit} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <p className="font-heading text-base font-semibold text-foreground">{session.label}</p>
        </div>

        <div className="rounded-xl border border-vert-vegetal/30 bg-vert-vegetal/5 p-5 space-y-3 text-center">
          <CheckCircle2 className="size-10 text-vert-vegetal mx-auto" />
          <p className="font-heading text-base font-semibold text-foreground">Séance terminée !</p>
          <div className="flex justify-center gap-4 text-sm text-foreground">
            <span>{doneGroups.length} prise{doneGroups.length > 1 ? "s" : ""}</span>
            {skippedGroups.length > 0 && (
              <span className="text-muted-foreground">{skippedGroups.length} passée{skippedGroups.length > 1 ? "s" : ""}</span>
            )}
          </div>
          {totalActual > 0 && (
            <div className="flex justify-center items-center gap-2 text-sm flex-wrap">
              <Clock className="size-3.5 text-muted-foreground" />
              <span className="font-mono">{formatDuration(Math.round(totalActual))}</span>
              <span className="text-muted-foreground">/ {formatDuration(sessionEstimatedSeconds)} prévu</span>
              <span className={cn("text-xs font-medium", delta > 0 ? "text-bordeaux" : "text-vert-vegetal")}>
                ({delta > 0 ? "+" : ""}{formatDuration(Math.abs(Math.round(delta)))})
              </span>
            </div>
          )}
        </div>

        {skippedGroups.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Groupes passés</p>
            {skippedGroups.map(g => (
              <div key={g.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-foreground">{g.label}</span>
                <Button size="sm" variant="outline"
                  onClick={() => updateGroup.mutate({ id: g.id, patch: { status: "pending" } })}>
                  Relancer
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={onQuit}>
          Retour aux séances
        </Button>
      </div>
    )
  }

  if (!activeGroup) return null

  const upcoming = pendingGroups.filter(g => g.id !== activeGroupId)

  // ── Freed announcement overlay ────────────────────────────────────────────

  if (freedNames && freedNames.length > 0) {
    const joined = freedNames.length === 1
      ? freedNames[0]
      : freedNames.length === 2
        ? `${freedNames[0]} et ${freedNames[1]}`
        : `${freedNames.slice(0, -1).join(", ")} et ${freedNames[freedNames.length - 1]}`
    const plural = freedNames.length > 1
    const announcement = plural
      ? `${joined}, merci pour votre patience ! Vous êtes libérés et pouvez rejoindre les autres invités.`
      : `${joined}, merci pour ta patience ! Tu es libéré${freedNames[0].endsWith("e") ? "e" : ""} et peux rejoindre les autres invités.`

    return (
      <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh] px-4 text-center">
        <div className="rounded-2xl border border-vert-vegetal/30 bg-vert-vegetal/5 p-6 space-y-4 w-full max-w-sm">
          <CheckCircle2 className="size-10 text-vert-vegetal mx-auto" />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-vert-vegetal">À dire</p>
            <p className="text-lg font-heading font-semibold text-foreground leading-snug">
              « {announcement} »
            </p>
          </div>
        </div>
        <Button size="lg" onClick={() => setFreedNames(null)}>
          Continuer
        </Button>
      </div>
    )
  }

  // ── Active group ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button type="button" onClick={onQuit} className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-base font-semibold text-foreground truncate">{session.label}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              {doneGroups.length} prise{doneGroups.length > 1 ? "s" : ""} · {pendingGroups.length} restante{pendingGroups.length > 1 ? "s" : ""}
            </span>
            <span className={cn(
              "flex items-center gap-1 font-mono font-medium",
              timeStatus === "over" ? "text-bordeaux" : timeStatus === "warn" ? "text-brun" : "text-foreground"
            )}>
              <Clock className="size-3" />
              {formatMs(sessionActualMs)} / {formatDuration(sessionEstimatedSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Active group card */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <p className="font-heading text-base font-semibold text-foreground flex-1">{activeGroup.label}</p>
          {activeGroup.isPriority && <Star className="size-3.5 fill-dore text-dore shrink-0" />}
        </div>

        {/* Members list */}
        <div className="space-y-1">
          {reqFiances.map(f => (
            <div key={f.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
              <div className="size-4 shrink-0 rounded-full border-2 border-bordeaux/40 bg-bordeaux/10" />
              <span className="text-sm font-medium text-bordeaux">{f.fullName}</span>
            </div>
          ))}
          {activeMembers.map(m => {
            const g = guestById.get(m.guestId)
            if (!g) return null
            return (
              <label key={m.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted/50 cursor-pointer">
                <Checkbox
                  checked={m.isPresent}
                  onCheckedChange={v => updateMember.mutate({ id: m.id, patch: { isPresent: !!v } })}
                />
                <span className={cn("text-sm", !m.isPresent && "line-through text-muted-foreground")}>
                  {g.fullName}
                </span>
              </label>
            )
          })}
        </div>

        {/* Per-group chrono */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2",
          groupElapsedMs / 1000 > activeEstimatedSeconds ? "bg-bordeaux/5" : "bg-muted/50"
        )}>
          <Clock className="size-3.5 text-muted-foreground shrink-0" />
          <span className={cn(
            "font-mono text-sm font-medium tabular-nums",
            groupElapsedMs / 1000 > activeEstimatedSeconds ? "text-bordeaux" : "text-foreground"
          )}>
            {formatMs(groupElapsedMs)}
          </span>
          <span className="text-xs text-muted-foreground">/ {formatDuration(activeEstimatedSeconds)} estimé</span>
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Pencil className="size-3" /> Note
          </label>
          <Textarea
            value={noteValue}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder="Attendre le grand-père, à refaire en fin de soirée…"
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={handlePasser} disabled={updateGroup.isPending}>
            <SkipForward className="size-3.5" />
            Passer
          </Button>
          <Button variant="outline" size="sm" onClick={onQuit}>
            <LogOut className="size-3.5" />
            Quitter
          </Button>
          <Button
            size="sm"
            className="bg-vert-vegetal hover:bg-vert-vegetal/90 text-white"
            onClick={handlePhotoPrise}
            disabled={updateGroup.isPending}
          >
            <Check className="size-3.5" />
            Photo prise
          </Button>
        </div>
      </div>

      {/* Upcoming groups */}
      {upcoming.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <button type="button" onClick={() => setShowUpcoming(v => !v)}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            {showUpcoming ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            <span>Groupes restants</span>
            <span className="ml-auto text-muted-foreground">{upcoming.length}</span>
          </button>
          {showUpcoming && (
            <div className="border-t border-border divide-y divide-border">
              {upcoming.map(g => {
                const gm = membersByGroupId.get(g.id) ?? []
                const rf = g.requiredFianceIds.length > 0 ? fiances.filter(f => g.requiredFianceIds.includes(f.id)) : fiances
                return (
                  <div key={g.id} className="flex items-center gap-3 px-4 py-2.5">
                    {g.isPriority && <Star className="size-3 fill-dore text-dore shrink-0" />}
                    <p className="flex-1 text-sm truncate text-foreground">{g.label}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{gm.length + rf.length} pers.</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function PhotosGroupePage() {
  const [screen, setScreen] = useState<Screen>("sessions")
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const { data: sessions = [], isLoading: sl } = usePhotoSessions()
  const { data: groups = [], isLoading: gl } = usePhotoGroups()
  const { data: members = [], isLoading: ml } = useAllPhotoGroupMembers()
  const { data: guests = [], isLoading: gul } = useGuests()
  const { data: guestGroups = [], isLoading: ggl } = useGuestGroups()
  const { data: people = [], isLoading: pl } = usePeople()
  const isLoading = sl || gl || ml || gul || ggl || pl

  const fiances = useMemo(() => people.filter(p => p.role === "fiance"), [people])
  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) ?? null, [sessions, activeSessionId])
  const sessionGroups = useMemo(() => groups.filter(g => g.sessionId === activeSessionId), [groups, activeSessionId])
  const sessionMembers = useMemo(
    () => members.filter(m => sessionGroups.some(g => g.id === m.photoGroupId)),
    [members, sessionGroups]
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Photos de groupe" description="" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (screen === "sessions" || !activeSession) {
    return (
      <div className="space-y-6">
        <PageHeader title="Photos de groupe" description="Gérez le déroulé des séances photo le jour J." />
        <SessionListScreen
          sessions={sessions}
          groups={groups}
          onEnter={id => { setActiveSessionId(id); setScreen("gathering") }}
        />
      </div>
    )
  }

  if (screen === "gathering") {
    return (
      <GatheringScreen
        session={activeSession}
        groups={sessionGroups}
        members={sessionMembers}
        guests={guests}
        guestGroups={guestGroups}
        fiances={fiances}
        onStart={() => setScreen("shooting")}
        onBack={() => setScreen("sessions")}
      />
    )
  }

  return (
    <ShootingScreen
      key={activeSessionId}
      session={activeSession}
      groups={sessionGroups}
      members={sessionMembers}
      guests={guests}
      fiances={fiances}
      onQuit={() => setScreen("sessions")}
    />
  )
}
