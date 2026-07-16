import { useEffect, useState } from "react"
import { Calendar, ChevronDown, ChevronRight, Clock, EarOff, MessageSquare, Mic, Pencil, Plus, RefreshCw, Rocket, Send, Trash2, User, Users, X } from "lucide-react"
import { toast } from "sonner"

import type { Domaine, Guest, Mission, MissionAcceptance, MissionSchedulingType, Person, RosDelivererType, RosDeliveryMode, RosLaunch, RosMessage, RosRecipientType, RunOfShowStep } from "@/types/domain"
import type { RosMessageInput } from "@/services/ros-messages.service"
import type { RosLaunchInput } from "@/services/ros-launches.service"
import { useCreateRosMessage, useDeleteRosMessage, useUpdateRosMessage } from "@/hooks/queries/use-ros-messages"
import { useCreateRosLaunch, useDeleteRosLaunch, useUpdateRosLaunch } from "@/hooks/queries/use-ros-launches"
import { useMissions, useUpdateMission } from "@/hooks/queries/use-missions"
import { useAllMissionAcceptances, useRespondToMission } from "@/hooks/queries/use-mission-acceptances"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { useDomaines } from "@/hooks/queries/use-domaines"
import { buildPhaseSegments, sortableTime, splitRunOfShowSteps } from "@/lib/run-of-show"
import { DOMAINE_PHASE_LABELS, DOMAINE_PHASE_ORDER } from "@/lib/constants"
import { MissionPicker } from "@/components/timing/MissionPicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ── Constantes ────────────────────────────────────────────────────────────────

const RECIPIENT_TYPES: { value: RosRecipientType; label: string }[] = [
  { value: "all_guests", label: "Tous les invités" },
  { value: "guest", label: "Invité spécifique" },
  { value: "fiance", label: "Un des fiancés" },
  { value: "both_fiances", label: "Les deux fiancés" },
  { value: "other", label: "Autre (traiteur, DJ…)" },
]

const OTHER_PRESETS = ["Traiteur", "DJ", "Photographe", "Vidéaste", "Coordinateur"]

// ── Helpers d'affichage ───────────────────────────────────────────────────────

function recipientLabel(msg: RosMessage, guests: Guest[], people: Person[]): string {
  if (!msg.recipientType) return "—"
  switch (msg.recipientType) {
    case "guest": return guests.find((x) => x.id === msg.recipientGuestId)?.fullName ?? "Invité inconnu"
    case "fiance": return people.find((x) => x.id === msg.recipientPersonId)?.fullName ?? "Fiancé(e) inconnu(e)"
    case "both_fiances": return "Les deux fiancés"
    case "all_guests": return "Tous les invités"
    case "other": return msg.recipientLabel ?? "Autre"
  }
}

function delivererLabel(msg: RosMessage, guests: Guest[], people: Person[]): string {
  switch (msg.delivererType) {
    case "both_fiances": return "Les deux fiancés"
    case "fiance": return people.find((x) => x.id === msg.delivererPersonId)?.fullName ?? "Fiancé(e) inconnu(e)"
    case "guest": return guests.find((x) => x.id === msg.delivererGuestId)?.fullName ?? "Inconnu"
    default:
      // rétro-compat : ancien enregistrement sans delivererType
      return msg.delivererGuestId ? (guests.find((x) => x.id === msg.delivererGuestId)?.fullName ?? "Inconnu") : ""
  }
}

// ── État du formulaire ────────────────────────────────────────────────────────

interface FormState {
  subject: string
  content: string
  scheduledTime: string
  deliveryMode: RosDeliveryMode | ""
  delivererType: RosDelivererType | ""
  delivererGuestId: string
  delivererPersonId: string
  recipientType: RosRecipientType | ""
  recipientGuestId: string
  recipientPersonId: string
  recipientLabel: string
}

function emptyForm(): FormState {
  return { subject: "", content: "", scheduledTime: "", deliveryMode: "", delivererType: "", delivererGuestId: "", delivererPersonId: "", recipientType: "", recipientGuestId: "", recipientPersonId: "", recipientLabel: "" }
}

function msgToForm(msg: RosMessage): FormState {
  return {
    subject: msg.subject ?? "",
    content: msg.content,
    scheduledTime: msg.scheduledTime ?? "",
    deliveryMode: msg.deliveryMode ?? "",
    delivererType: msg.delivererType ?? (msg.delivererGuestId ? "guest" : ""),
    delivererGuestId: msg.delivererGuestId ?? "",
    delivererPersonId: msg.delivererPersonId ?? "",
    recipientType: msg.recipientType ?? "",
    recipientGuestId: msg.recipientGuestId ?? "",
    recipientPersonId: msg.recipientPersonId ?? "",
    recipientLabel: msg.recipientLabel ?? "",
  }
}

// ── Dialog create / edit ──────────────────────────────────────────────────────

interface MessageDialogProps {
  open: boolean
  onClose: () => void
  stepId: string
  sortOrder: number
  editing?: RosMessage
  guests: Guest[]
  people: Person[]
}

function MessageDialog({ open, onClose, stepId, sortOrder, editing, guests, people }: MessageDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const create = useCreateRosMessage()
  const update = useUpdateRosMessage()

  useEffect(() => {
    if (!open) return
    setForm(editing ? msgToForm(editing) : emptyForm())
  }, [open, editing])

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function changeDelivererType(v: string) {
    setForm((prev) => ({ ...prev, delivererType: v as RosDelivererType | "", delivererGuestId: "", delivererPersonId: "" }))
  }

  function changeRecipientType(v: string) {
    setForm((prev) => ({ ...prev, recipientType: v as RosRecipientType, recipientGuestId: "", recipientPersonId: "", recipientLabel: "" }))
  }

  const assignableGuests = guests.filter((g) => g.assignable)
  const canSubmit = form.content.trim().length > 0
  const isPending = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: Omit<RosMessageInput, "stepId"> = {
      subject: form.subject.trim() || null,
      content: form.content.trim(),
      scheduledTime: form.scheduledTime || null,
      deliveryMode: (form.deliveryMode as RosDeliveryMode) || null,
      delivererType: (form.delivererType as RosDelivererType) || null,
      delivererGuestId: form.delivererType === "guest" ? (form.delivererGuestId || null) : null,
      delivererPersonId: form.delivererType === "fiance" ? (form.delivererPersonId || null) : null,
      recipientType: (form.recipientType as RosRecipientType) || null,
      recipientGuestId: form.recipientType === "guest" ? (form.recipientGuestId || null) : null,
      recipientPersonId: form.recipientType === "fiance" ? (form.recipientPersonId || null) : null,
      recipientLabel: form.recipientType === "other" ? (form.recipientLabel || null) : null,
    }
    if (editing) {
      await update.mutateAsync({ id: editing.id, patch: payload })
      toast.success("Message mis à jour.")
    } else {
      await create.mutateAsync({ stepId, sortOrder, ...payload })
      toast.success("Message créé.")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{editing ? "Modifier le message" : "Nouveau message"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="msg-subject">Objet</FieldLabel>
              <Input id="msg-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Ex. Rappel DJ" />
            </Field>

            <Field>
              <FieldLabel htmlFor="msg-time">Heure (optionnel)</FieldLabel>
              <Input id="msg-time" type="time" value={form.scheduledTime} onChange={(e) => set("scheduledTime", e.target.value)} className="w-36" />
            </Field>

            <Field>
              <FieldLabel>Mode de transmission</FieldLabel>
              <div className="flex gap-2">
                {([
                  { value: "", label: "Non précisé" },
                  { value: "micro", label: "Au micro", icon: Mic },
                  { value: "discret", label: "Discrètement", icon: EarOff },
                ] as const).map((opt) => {
                  const Icon = "icon" in opt ? opt.icon : null
                  const active = form.deliveryMode === opt.value
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => set("deliveryMode", opt.value as RosDeliveryMode | "")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                        active
                          ? "border-bordeaux/40 bg-bordeaux/10 text-bordeaux font-medium"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      )}>
                      {Icon && <Icon className="size-3.5" />}
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="msg-content">Contenu *</FieldLabel>
              <textarea
                id="msg-content"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={3}
                required
                placeholder="Texte du message à transmettre…"
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </Field>

            <Field>
              <FieldLabel>Qui délivre</FieldLabel>
              <Select value={form.delivererType || "__none__"} onValueChange={(v) => changeDelivererType(v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Non assigné</SelectItem>
                  <SelectItem value="both_fiances">Les deux fiancés</SelectItem>
                  <SelectItem value="fiance">Un des fiancés</SelectItem>
                  <SelectItem value="guest">Invité assignable</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {form.delivererType === "fiance" && (
              <Field>
                <FieldLabel>Fiancé(e)</FieldLabel>
                <Select value={form.delivererPersonId || "__none__"} onValueChange={(v) => set("delivererPersonId", v === "__none__" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {form.delivererType === "guest" && (
              <Field>
                <FieldLabel>Invité</FieldLabel>
                <Select value={form.delivererGuestId || "__none__"} onValueChange={(v) => set("delivererGuestId", v === "__none__" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un bénévole…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    {assignableGuests.map((g) => <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field>
              <FieldLabel>Destinataire</FieldLabel>
              <Select value={form.recipientType || "__none__"} onValueChange={(v) => changeRecipientType(v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Qui doit recevoir le message ?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Non précisé</SelectItem>
                  {RECIPIENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            {form.recipientType === "guest" && (
              <Field>
                <FieldLabel>Invité destinataire</FieldLabel>
                <Select value={form.recipientGuestId || "__none__"} onValueChange={(v) => set("recipientGuestId", v === "__none__" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Choisir un invité…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Non précisé</SelectItem>
                    {assignableGuests.map((g) => <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {form.recipientType === "fiance" && (
              <Field>
                <FieldLabel>Fiancé(e) destinataire</FieldLabel>
                <Select value={form.recipientPersonId || "__none__"} onValueChange={(v) => set("recipientPersonId", v === "__none__" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Non précisé</SelectItem>
                    {people.map((p) => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {form.recipientType === "other" && (
              <Field>
                <FieldLabel htmlFor="msg-recipient-label">Préciser</FieldLabel>
                <div className="space-y-2">
                  <Input id="msg-recipient-label" value={form.recipientLabel}
                    onChange={(e) => set("recipientLabel", e.target.value)}
                    placeholder="Ex. Traiteur, DJ, Photographe…" />
                  <div className="flex flex-wrap gap-1.5">
                    {OTHER_PRESETS.map((p) => (
                      <button key={p} type="button" onClick={() => set("recipientLabel", p)}
                        className={cn("rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                          form.recipientLabel === p
                            ? "border-bordeaux/40 bg-bordeaux/10 text-bordeaux"
                            : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        )}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            )}
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isPending || !canSubmit}>{editing ? "Enregistrer" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Carte d'un message ────────────────────────────────────────────────────────

function MessageCard({ msg, guests, people, onEdit }: {
  msg: RosMessage; guests: Guest[]; people: Person[]; onEdit: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const deleteMsg = useDeleteRosMessage()

  return (
    <div className="group rounded-xl border border-border bg-card px-4 py-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {msg.subject && <span className="font-medium text-sm text-foreground">{msg.subject}</span>}
          {msg.scheduledTime && (
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Clock className="size-3" />{msg.scheduledTime}
            </span>
          )}
          {msg.deliveryMode === "micro" && (
            <span className="flex items-center gap-1 rounded-full bg-bordeaux/10 px-2 py-0.5 text-[10px] font-semibold text-bordeaux">
              <Mic className="size-3" />Micro
            </span>
          )}
          {msg.deliveryMode === "discret" && (
            <span className="flex items-center gap-1 rounded-full bg-lagon/10 px-2 py-0.5 text-[10px] font-semibold text-lagon">
              <EarOff className="size-3" />Discret
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button type="button" variant="ghost" size="icon-xs" onClick={onEdit}><Pencil className="size-3.5" /></Button>
          {confirming ? (
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(false)}><X className="size-3.5" /></Button>
              <Button type="button" variant="destructive" size="sm" disabled={deleteMsg.isPending}
                onClick={async () => { await deleteMsg.mutateAsync(msg.id); toast.success("Message supprimé.") }}>
                Supprimer
              </Button>
            </div>
          ) : (
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(true)}><Trash2 className="size-3.5" /></Button>
          )}
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {(msg.delivererType || msg.delivererGuestId) && (
          <span className="flex items-center gap-1">
            <Send className="size-3 shrink-0" />
            <span className="font-medium text-foreground">{delivererLabel(msg, guests, people)}</span>
          </span>
        )}
        {msg.recipientType && (
          <span className="flex items-center gap-1">
            {(msg.recipientType === "both_fiances" || msg.recipientType === "all_guests") ? <Users className="size-3 shrink-0" /> : <User className="size-3 shrink-0" />}
            <span className="font-medium text-foreground">{recipientLabel(msg, guests, people)}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ── Dialog lancement ──────────────────────────────────────────────────────────

interface LaunchFormState {
  missionId: string
  label: string
  scheduledTime: string
}

function emptyLaunchForm(): LaunchFormState {
  return { missionId: "", label: "", scheduledTime: "" }
}

function launchToForm(launch: RosLaunch): LaunchFormState {
  return {
    missionId: launch.missionId ?? "",
    label: launch.label ?? "",
    scheduledTime: launch.scheduledTime ?? "",
  }
}

interface LaunchDialogProps {
  open: boolean
  onClose: () => void
  stepId: string
  sortOrder: number
  editing?: RosLaunch
  guests: Guest[]
  people: Person[]
  missions: Mission[]
}

function LaunchDialog({ open, onClose, stepId, sortOrder, editing, guests, people, missions }: LaunchDialogProps) {
  const [form, setForm] = useState<LaunchFormState>(emptyLaunchForm)
  const create = useCreateRosLaunch()
  const update = useUpdateRosLaunch()
  const respondToMission = useRespondToMission()
  const { data: acceptances = [] } = useAllMissionAcceptances()

  useEffect(() => {
    if (!open) return
    setForm(editing ? launchToForm(editing) : emptyLaunchForm())
  }, [open, editing])

  function set<K extends keyof LaunchFormState>(key: K, val: LaunchFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const assignableGuests = guests.filter((g) => g.assignable)
  const canSubmit = form.missionId !== "" || form.label.trim().length > 0
  const isPending = create.isPending || update.isPending

  const currentAcceptance = acceptances.find(
    (a) => a.missionId === form.missionId && a.status === "accepted"
  )
  const currentAssigneeId = currentAcceptance?.guestId ?? ""

  async function handleAssigneeChange(guestId: string) {
    if (!form.missionId) return
    if (currentAcceptance && currentAcceptance.guestId !== guestId) {
      await respondToMission.mutateAsync({ missionId: form.missionId, guestId: currentAcceptance.guestId, status: "pending" })
    }
    if (guestId) {
      await respondToMission.mutateAsync({ missionId: form.missionId, guestId, status: "accepted" })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: Omit<RosLaunchInput, "stepId"> = {
      missionId: form.missionId || null,
      label: form.label.trim() || null,
      scheduledTime: form.scheduledTime || null,
    }
    if (editing) {
      await update.mutateAsync({ id: editing.id, patch: payload })
      toast.success("Lancement mis à jour.")
    } else {
      await create.mutateAsync({ stepId, sortOrder, ...payload })
      toast.success("Lancement créé.")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="flex flex-col sm:max-w-lg max-h-[90svh]">
        <DialogHeader>
          <DialogTitle className="font-heading">{editing ? "Modifier le lancement" : "Lancer une mission"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 gap-4">
          <div className="overflow-y-auto space-y-4 pr-1">
          <FieldGroup>
            <Field>
              <FieldLabel>Mission / tâche</FieldLabel>
              <MissionPicker
                value={{ missionId: form.missionId, label: form.label }}
                onChange={({ missionId, label }) => setForm((prev) => ({ ...prev, missionId, label }))}
                missions={missions}
              />
            </Field>


            <Field>
              <FieldLabel htmlFor="launch-time">Heure (optionnel)</FieldLabel>
              <Input id="launch-time" type="time" value={form.scheduledTime} onChange={(e) => set("scheduledTime", e.target.value)} className="w-36" />
            </Field>

            {form.missionId && (
              <Field>
                <FieldLabel>Assigné à</FieldLabel>
                <Select
                  value={currentAssigneeId || "__none__"}
                  onValueChange={(v) => handleAssigneeChange(v === "__none__" ? "" : v)}
                  disabled={respondToMission.isPending}
                >
                  <SelectTrigger><SelectValue placeholder="Non assigné" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Non assigné</SelectItem>
                    {assignableGuests.map((g) => <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 pt-1 shrink-0">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isPending || !canSubmit}>{editing ? "Enregistrer" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Carte d'un lancement (config) ────────────────────────────────────────────

function launchLabel(launch: RosLaunch, missions: Mission[]): string {
  if (launch.label) return launch.label
  if (launch.missionId) return missions.find((m) => m.id === launch.missionId)?.title ?? "Mission inconnue"
  return "—"
}

function LaunchCard({ launch, guests, missions, onEdit }: {
  launch: RosLaunch; guests: Guest[]; missions: Mission[]; onEdit: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const deleteLaunch = useDeleteRosLaunch()
  const { data: acceptances = [] } = useAllMissionAcceptances()
  const label = launchLabel(launch, missions)
  const assigneeGuestId = acceptances.find(
    (a) => a.missionId === launch.missionId && a.status === "accepted"
  )?.guestId
  const assignee = assigneeGuestId ? guests.find((g) => g.id === assigneeGuestId)?.fullName : null

  return (
    <div className="group rounded-xl border border-dore/30 bg-dore/5 px-4 py-3 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Rocket className="size-3.5 shrink-0 text-dore" />
          <span className="font-medium text-sm text-foreground">{label}</span>
          {launch.scheduledTime && (
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Clock className="size-3" />{launch.scheduledTime}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button type="button" variant="ghost" size="icon-xs" onClick={onEdit}><Pencil className="size-3.5" /></Button>
          {confirming ? (
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(false)}><X className="size-3.5" /></Button>
              <Button type="button" variant="destructive" size="sm" disabled={deleteLaunch.isPending}
                onClick={async () => { await deleteLaunch.mutateAsync(launch.id); toast.success("Lancement supprimé.") }}>
                Supprimer
              </Button>
            </div>
          ) : (
            <Button type="button" variant="ghost" size="icon-xs" onClick={() => setConfirming(true)}><Trash2 className="size-3.5" /></Button>
          )}
        </div>
      </div>
      {assignee && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3 shrink-0" />
          <span className="font-medium text-foreground">{assignee}</span>
        </div>
      )}
    </div>
  )
}

// ── Ligne d'étape ─────────────────────────────────────────────────────────────

function StepRow({ step, messages, launches, guests, people, missions }: {
  step: RunOfShowStep; messages: RosMessage[]; launches: RosLaunch[]; guests: Guest[]; people: Person[]; missions: Mission[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [msgDialogOpen, setMsgDialogOpen] = useState(false)
  const [editingMsg, setEditingMsg] = useState<RosMessage | undefined>(undefined)
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false)
  const [editingLaunch, setEditingLaunch] = useState<RosLaunch | undefined>(undefined)

  const stepMsgs = messages.filter((m) => m.stepId === step.id).sort((a, b) => {
    if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
    if (a.scheduledTime) return -1
    if (b.scheduledTime) return 1
    return a.sortOrder - b.sortOrder
  })

  const stepLaunches = launches.filter((l) => l.stepId === step.id).sort((a, b) => {
    if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
    if (a.scheduledTime) return -1
    if (b.scheduledTime) return 1
    return a.sortOrder - b.sortOrder
  })

  return (
    <>
      <div className="border-b border-border last:border-0">
        <button type="button" onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors">
          {expanded
            ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-bordeaux">{step.timeLabel}</span>
              <span className="text-sm font-medium text-foreground">{step.label}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {stepMsgs.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-dore">
                <MessageSquare className="size-3.5" />{stepMsgs.length}
              </span>
            )}
            {stepLaunches.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-brun">
                <Rocket className="size-3.5" />{stepLaunches.length}
              </span>
            )}
          </div>
        </button>

        {expanded && (
          <div className="px-4 pb-4 pt-1 space-y-2 bg-muted/20">
            {/* Messages */}
            {stepMsgs.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-1">Messages</p>
            )}
            {stepMsgs.map((msg) => (
              <MessageCard key={msg.id} msg={msg} guests={guests} people={people}
                onEdit={() => { setEditingMsg(msg); setMsgDialogOpen(true) }} />
            ))}

            {/* Lancements */}
            {stepLaunches.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-2">Lancements</p>
            )}
            {stepLaunches.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} guests={guests} missions={missions}
                onEdit={() => { setEditingLaunch(launch); setLaunchDialogOpen(true) }} />
            ))}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
              <button type="button"
                onClick={() => { setEditingMsg(undefined); setMsgDialogOpen(true) }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="size-3.5" />Ajouter un message
              </button>
              <button type="button"
                onClick={() => { setEditingLaunch(undefined); setLaunchDialogOpen(true) }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Rocket className="size-3.5" />Lancer une mission
              </button>
            </div>
          </div>
        )}
      </div>

      <MessageDialog open={msgDialogOpen} onClose={() => setMsgDialogOpen(false)}
        stepId={step.id} sortOrder={stepMsgs.length}
        editing={editingMsg} guests={guests} people={people} />

      <LaunchDialog open={launchDialogOpen} onClose={() => setLaunchDialogOpen(false)}
        stepId={step.id} sortOrder={stepLaunches.length}
        editing={editingLaunch} guests={guests} people={people} missions={missions} />
    </>
  )
}

// ── Missions sans planification ───────────────────────────────────────────────

const PHASE_BADGE_CLASS: Record<string, string> = {
  avant:           "bg-lagon/15 text-lagon",
  installation:    "bg-brun/15 text-brun",
  jour_j:          "bg-bordeaux/15 text-bordeaux",
  desinstallation: "bg-corail/15 text-corail",
  apres:           "bg-muted text-muted-foreground",
}

function UnscheduledMissionsPanel({ missions, domaines, launches }: { missions: Mission[]; domaines: Domaine[]; launches: RosLaunch[] }) {
  const updateMission = useUpdateMission()
  const [expanded, setExpanded] = useState(true)

  const domaineById = new Map(domaines.map((d) => [d.id, d]))
  const launchedMissionIds = new Set(launches.map((l) => l.missionId).filter(Boolean))
  const phaseIdx = (phase?: string | null) => {
    const i = DOMAINE_PHASE_ORDER.findIndex((p) => p === phase)
    return i >= 0 ? i : 99
  }
  const unscheduled = missions
    .filter((m) => {
      const d = m.domaineId ? domaineById.get(m.domaineId) : undefined
      return d?.phase !== "avant"
        && d?.phase !== "apres"
        && m.schedulingType !== "en_continu"
        && !launchedMissionIds.has(m.id)
    })
    .sort((a, b) => {
      const dA = a.domaineId ? domaineById.get(a.domaineId) : undefined
      const dB = b.domaineId ? domaineById.get(b.domaineId) : undefined
      const diff = phaseIdx(dA?.phase) - phaseIdx(dB?.phase)
      return diff !== 0 ? diff : a.title.localeCompare(b.title, "fr")
    })

  if (unscheduled.length === 0) return null

  function handle(missionId: string, type: MissionSchedulingType) {
    const { mutate } = updateMission
    updateMission.mutateAsync({ id: missionId, patch: { schedulingType: type } }).then(() => {
      const label = type === "planifiee" ? "Planifiée" : "En continu"
      toast.success(`Mission · ${label}`, {
        action: {
          label: "Annuler",
          onClick: () => mutate({ id: missionId, patch: { schedulingType: null } }),
        },
      })
    })
  }

  return (
    <div className="rounded-xl border border-lagon/30 bg-lagon/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-lagon/10 transition-colors"
      >
        <Calendar className="size-4 shrink-0 text-lagon" />
        <span className="flex-1 text-sm font-medium text-lagon">
          {unscheduled.length} mission{unscheduled.length > 1 ? "s" : ""} sans planification timing
        </span>
        {expanded
          ? <ChevronDown className="size-4 shrink-0 text-lagon" />
          : <ChevronRight className="size-4 shrink-0 text-lagon" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {unscheduled.map((m) => {
            const d = m.domaineId ? domaineById.get(m.domaineId) : undefined
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.title}</p>
                  {d && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{d.name}</span>
                      {d.phase && (
                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", PHASE_BADGE_CLASS[d.phase])}>
                          {DOMAINE_PHASE_LABELS[d.phase]}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handle(m.id, "en_continu")}
                  disabled={updateMission.isPending}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="size-3 shrink-0" />En continu
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

interface Props {
  steps: RunOfShowStep[]
  messages: RosMessage[]
  launches: RosLaunch[]
}

export function MessagesConfig({ steps, messages, launches }: Props) {
  const { data: guests = [] } = useGuests()
  const { data: people = [] } = usePeople()
  const { data: missions = [] } = useMissions()
  const { data: domaines = [] } = useDomaines()

  const { prep, program } = splitRunOfShowSteps(steps)
  const allDated = [...prep, ...program]
  const segments = buildPhaseSegments(allDated).filter((s) => s.steps.length > 0)

  const totalMessages = messages.length
  const sentMessages = messages.filter((m) => m.sentAt !== null).length
  const totalLaunches = launches.length
  const doneLaunches = launches.filter((l) => l.launchedAt !== null).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Messages configurés</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{totalMessages}</p>
        </div>
        <div className="rounded-xl border border-vert-vegetal/30 bg-vert-vegetal/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Envoyés</p>
          <p className="text-2xl font-bold tabular-nums text-vert-vegetal">{sentMessages}</p>
        </div>
        <div className="rounded-xl border border-dore/30 bg-dore/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Lancements configurés</p>
          <p className="text-2xl font-bold tabular-nums text-brun">{totalLaunches}</p>
        </div>
        <div className="rounded-xl border border-lagon/30 bg-lagon/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Lancés</p>
          <p className="text-2xl font-bold tabular-nums text-lagon">{doneLaunches}</p>
        </div>
      </div>

      <UnscheduledMissionsPanel missions={missions} domaines={domaines} launches={launches} />

      {segments.map((seg, gi) => (
        <div key={gi} className="space-y-1">
          <div className="flex items-center gap-2 px-1">
            <span className={cn("size-2.5 rounded-full", seg.style.barClass)} />
            <h3 className="font-heading text-sm font-semibold text-foreground">{seg.style.label}</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            {seg.steps.map((step) => (
              <StepRow key={step.id} step={step} messages={messages} launches={launches}
                guests={guests} people={people} missions={missions} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
