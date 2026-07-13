import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Eye, KeyRound, Pencil, Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import type { AccessCodeEntry } from "@/services/access-codes.service"
import {
  useAccessCodes,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
  type CreateAccountInput,
  type UpdateAccountInput,
} from "@/hooks/queries/use-access-codes"
import { useGuests } from "@/hooks/queries/use-guests"
import { identityService } from "@/services/identity.service"
import { useIdentity } from "@/context/IdentityContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ── Copier ────────────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon-xs" onClick={handleCopy}
          className={cn("shrink-0 transition-colors", copied && "text-vert-vegetal")}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copié !" : "Copier"}</TooltipContent>
    </Tooltip>
  )
}

// ── Suppression deux-temps ────────────────────────────────────────────────────

function DeleteButton({ onConfirm, isPending }: { onConfirm: () => void; isPending: boolean }) {
  const [confirming, setConfirming] = useState(false)
  if (confirming) {
    return (
      <div className="flex items-center gap-0.5">
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(false)}>
          <X className="size-3.5" />
        </Button>
        <Button type="button" variant="destructive" size="sm" disabled={isPending}
          onClick={() => { onConfirm(); setConfirming(false) }}>
          Confirmer
        </Button>
      </div>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(true)}>
          <Trash2 className="size-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Révoquer l'accès</TooltipContent>
    </Tooltip>
  )
}

// ── Sélecteur d'invité ────────────────────────────────────────────────────────

function GuestPicker({
  value,
  onChange,
  excludeIds,
}: {
  value: string
  onChange: (id: string) => void
  excludeIds: Set<string>
}) {
  const { data: guests } = useGuests()
  const [search, setSearch] = useState("")

  const available = useMemo(
    () =>
      (guests ?? [])
        .filter((g) => !excludeIds.has(g.id))
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [guests, excludeIds]
  )

  const filtered = search.trim()
    ? available.filter((g) => g.fullName.toLowerCase().includes(search.toLowerCase()))
    : available

  const selected = available.find((g) => g.id === value)

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-vert-vegetal/40 bg-vert-vegetal/5 px-3 py-2">
        <p className="flex-1 text-sm font-medium text-foreground">{selected.fullName}</p>
        <Button type="button" variant="ghost" size="icon-xs" onClick={() => { onChange(""); setSearch("") }}>
          <X className="size-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un invité…"
        autoComplete="off"
      />
      {filtered.length === 0 ? (
        <p className="py-2 text-center text-xs text-muted-foreground">
          {available.length === 0 ? "Tous les invités ont déjà un compte." : "Aucun résultat."}
        </p>
      ) : (
        <div className="max-h-44 overflow-y-auto rounded-lg border border-border">
          {filtered.map((g) => (
            <button
              key={g.id}
              type="button"
              className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-muted/60"
              onClick={() => onChange(g.id)}
            >
              {g.fullName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Dialog création ───────────────────────────────────────────────────────────

function CreateDialog({ existingGuestIds }: { existingGuestIds: Set<string> }) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<"fiance" | "guest">("guest")
  const [fullName, setFullName] = useState("")
  const [guestId, setGuestId] = useState("")
  const [code, setCode] = useState("")
  const create = useCreateAccount()

  function reset() {
    setKind("guest")
    setFullName("")
    setGuestId("")
    setCode("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    const input: CreateAccountInput = { kind, accessCode: code }
    if (kind === "fiance") {
      if (!fullName.trim()) return
      input.fullName = fullName
    } else {
      if (!guestId) return
      input.guestId = guestId
    }
    await create.mutateAsync(input)
    toast.success("Compte créé.")
    reset()
    setOpen(false)
  }

  const canSubmit = code.trim() && (kind === "fiance" ? !!fullName.trim() : !!guestId)

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Nouveau compte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Nouveau compte</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Type de compte</FieldLabel>
              <Select value={kind} onValueChange={(v) => { setKind(v as "fiance" | "guest"); setGuestId(""); setFullName("") }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Invité existant</SelectItem>
                  <SelectItem value="fiance">Fiancé(e)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {kind === "fiance" ? (
              <Field>
                <FieldLabel htmlFor="ac-fullname">Nom complet</FieldLabel>
                <Input id="ac-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex. Sarah" required />
              </Field>
            ) : (
              <Field>
                <FieldLabel>Invité</FieldLabel>
                <GuestPicker value={guestId} onChange={setGuestId} excludeIds={existingGuestIds} />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="ac-code">Code d'accès</FieldLabel>
              <Input id="ac-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex. MARIE2026" className="font-mono uppercase" required />
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={create.isPending || !canSubmit}>Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Dialog édition ────────────────────────────────────────────────────────────

function EditDialog({ entry }: { entry: AccessCodeEntry }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState(entry.accessCode)
  const [isActive, setIsActive] = useState(entry.isActive)
  const update = useUpdateAccount()

  useEffect(() => {
    if (!open) return
    setCode(entry.accessCode)
    setIsActive(entry.isActive)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const patch: UpdateAccountInput = { accessCode: code, isActive }
    await update.mutateAsync({ entry, patch })
    toast.success("Compte mis à jour.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon-xs"><Pencil className="size-3.5" /></Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Modifier</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">{entry.fullName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ed-code">Code d'accès</FieldLabel>
              <Input id="ed-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono uppercase" required />
            </Field>
            <div className="flex items-center gap-3">
              <FieldLabel className="mb-0">Compte actif</FieldLabel>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={update.isPending || !code.trim()}>Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Ligne de compte ───────────────────────────────────────────────────────────

function AccountRow({ entry }: { entry: AccessCodeEntry }) {
  const deleteAccount = useDeleteAccount()
  const { impersonate } = useIdentity()
  const navigate = useNavigate()

  async function handleImpersonate() {
    const identity = await identityService.getById(entry.id)
    if (!identity) { toast.error("Impossible de charger ce compte."); return }
    impersonate(identity)
    navigate("/")
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{entry.fullName}</p>
        {!entry.isActive && <p className="text-xs text-muted-foreground">Inactif</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <code className="rounded-md border border-border bg-muted/60 px-2.5 py-1 font-mono text-xs text-foreground">
          {entry.accessCode}
        </code>
        <CopyButton value={entry.accessCode} />
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {entry.kind === "guest" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon-xs" onClick={handleImpersonate}>
                <Eye className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voir en tant que {entry.fullName}</TooltipContent>
          </Tooltip>
        )}
        <EditDialog entry={entry} />
        <DeleteButton
          isPending={deleteAccount.isPending}
          onConfirm={async () => {
            await deleteAccount.mutateAsync(entry)
            toast.success(entry.kind === "fiance" ? "Compte supprimé." : "Accès révoqué.")
          }}
        />
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function AccessCodesManager() {
  const { data: entries, isLoading } = useAccessCodes()

  const fiances = (entries ?? []).filter((e) => e.kind === "fiance")
  const guests = (entries ?? []).filter((e) => e.kind === "guest")

  const existingGuestIds = useMemo(
    () => new Set(guests.map((e) => e.id)),
    [guests]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-4 text-muted-foreground" />
            Comptes et codes d'accès
          </CardTitle>
          <CreateDialog existingGuestIds={existingGuestIds} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : !entries || entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun compte avec un code d'accès.</p>
        ) : (
          <div className="space-y-6">
            {fiances.length > 0 && <Section title="Fiancés" entries={fiances} badge="fiance" />}
            {guests.length > 0 && <Section title="Invités" entries={guests} badge="guest" />}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Section({ title, entries, badge }: { title: string; entries: AccessCodeEntry[]; badge: "fiance" | "guest" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <Badge variant="outline" className={cn("text-[10px]", badge === "fiance" ? "text-dore border-dore/40" : "text-bordeaux border-bordeaux/40")}>
          {entries.length}
        </Badge>
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {entries.map((entry) => <AccountRow key={entry.id} entry={entry} />)}
      </div>
    </div>
  )
}
