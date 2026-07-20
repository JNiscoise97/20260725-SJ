import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight, RotateCcw, Smartphone } from "lucide-react"
import { toast } from "sonner"

import type { Capability } from "@/types/permissions"
import { NAV_ITEMS } from "@/lib/constants"
import { useAccessCodes } from "@/hooks/queries/use-access-codes"
import { useGuests, useUpdateGuest } from "@/hooks/queries/use-guests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Onglets configurables : tous les view:* sauf ceux réservés aux fiancés (visibleToRoles: ["fiance"])
const CONFIGURABLE_TABS: { capability: Capability; label: string }[] = NAV_ITEMS
  .filter(item => {
    if (!item.capability.startsWith("view:")) return false
    if (item.visibleToRoles?.length === 1 && item.visibleToRoles[0] === "fiance") return false
    return true
  })
  .filter((item, i, arr) => arr.findIndex(x => x.capability === item.capability) === i)
  .map(item => ({ capability: item.capability as Capability, label: item.label }))

// Defaults du rôle "invite" — affichés quand allowedTabs est null
const INVITE_DEFAULT: Capability[] = ["view:introduction"]

// ── Ligne de toggle ────────────────────────────────────────────────────────────

function TabToggle({
  capability,
  label,
  checked,
  onChange,
}: {
  capability: Capability
  label: string
  checked: boolean
  onChange: (cap: Capability, val: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-muted/40 transition-colors">
      <Switch
        checked={checked}
        onCheckedChange={val => onChange(capability, val)}
        className="shrink-0"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

// ── Carte invité ───────────────────────────────────────────────────────────────

function GuestTabCard({ guestId, fullName }: { guestId: string; fullName: string }) {
  const [open, setOpen] = useState(false)
  const { data: guests } = useGuests()
  const update = useUpdateGuest()

  const guest = guests?.find(g => g.id === guestId)
  const isCustomized = guest?.allowedTabs != null
  const effectiveTabs = useMemo<Capability[]>(
    () => (guest?.allowedTabs ?? INVITE_DEFAULT) as Capability[],
    [guest?.allowedTabs]
  )
  // Seuls les onglets encore présents dans NAV_ITEMS comptent (stale caps ignorées)
  const visibleCount = useMemo(
    () => effectiveTabs.filter(c => CONFIGURABLE_TABS.some(t => t.capability === c)).length,
    [effectiveTabs]
  )

  async function handleToggle(cap: Capability, val: boolean) {
    const knownCaps = new Set(CONFIGURABLE_TABS.map(t => t.capability))
    const base = effectiveTabs.filter(c => knownCaps.has(c))
    const next = val ? [...new Set([...base, cap])] : base.filter(c => c !== cap)
    await update.mutateAsync({ id: guestId, patch: { allowedTabs: next } })
  }

  async function handleReset() {
    await update.mutateAsync({ id: guestId, patch: { allowedTabs: null } })
    toast.success("Onglets réinitialisés aux défauts du rôle.")
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        {open ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
        <span className="flex-1 text-sm font-medium text-foreground">{fullName}</span>
        <span className="text-xs text-muted-foreground">
          {visibleCount} onglet{visibleCount !== 1 ? "s" : ""}
        </span>
        {isCustomized ? (
          <Badge variant="outline" className="text-[10px] text-dore border-dore/40">Personnalisé</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">Défaut</Badge>
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-3 space-y-3">
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIGURABLE_TABS.map(({ capability, label }) => (
              <TabToggle
                key={capability}
                capability={capability}
                label={label}
                checked={effectiveTabs.includes(capability)}
                onChange={handleToggle}
              />
            ))}
          </div>
          {isCustomized && (
            <div className="flex justify-end border-t border-border pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleReset}
                disabled={update.isPending}
              >
                <RotateCcw className="size-3.5" />
                Réinitialiser aux défauts
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function GuestTabsManager() {
  const { data: entries, isLoading } = useAccessCodes()

  const guestAccounts = useMemo(
    () => (entries ?? []).filter(e => e.kind === "guest"),
    [entries]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2 text-base")}>
          <Smartphone className="size-4 text-muted-foreground" />
          Onglets par compte invité
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : guestAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun compte invité configuré.</p>
        ) : (
          <div className="space-y-2">
            {guestAccounts.map(entry => (
              <GuestTabCard key={entry.id} guestId={entry.id} fullName={entry.fullName} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
