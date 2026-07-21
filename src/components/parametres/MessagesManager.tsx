import { useEffect, useState } from "react"
import { EarOff, MessageSquare, Mic, Pencil, Plus, Send, Trash2, User, Users, X } from "lucide-react"
import { toast } from "sonner"

import type { Guest, Person, RosDelivererType, RosDeliveryMode, RosMessage, RosRecipientType, RunOfShowStep } from "@/types/domain"
import type { RosMessageInput } from "@/services/ros-messages.service"
import { useCreateRosMessage, useDeleteRosMessage, useRosMessages, useUpdateRosMessage } from "@/hooks/queries/use-ros-messages"
import { useRunOfShow } from "@/hooks/queries/use-run-of-show"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { sortableTime, splitRunOfShowSteps } from "@/lib/run-of-show"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ── Constantes ────────────────────────────────────────────────────────────────

const RECIPIENT_TYPES: { value: RosRecipientType; label: string }[] = [
  { value: "all_guests",   label: "Tous les invités" },
  { value: "guest",        label: "Invité spécifique" },
  { value: "fiance",       label: "Un des fiancés" },
  { value: "both_fiances", label: "Les deux fiancés" },
  { value: "other",        label: "Autre (traiteur, DJ…)" },
]

const OTHER_PRESETS = ["Traiteur", "DJ", "Photographe", "Vidéaste", "Coordinateur"]

// ── Helpers ───────────────────────────────────────────────────────────────────

function recipientLabel(msg: RosMessage, guests: Guest[], people: Person[]): string {
  if (!msg.recipientType) return "—"
  switch (msg.recipientType) {
    case "guest":        return guests.find((x) => x.id === msg.recipientGuestId)?.fullName ?? "Invité inconnu"
    case "fiance":       return people.find((x) => x.id === msg.recipientPersonId)?.fullName ?? "Fiancé(e) inconnu(e)"
    case "both_fiances": return "Les deux fiancés"
    case "all_guests":   return "Tous les invités"
    case "other":        return msg.recipientLabel ?? "Autre"
  }
}

function delivererLabel(msg: RosMessage, guests: Guest[], people: Person[]): string {
  switch (msg.delivererType) {
    case "both_fiances": return "Les deux fiancés"
    case "fiance":       return people.find((x) => x.id === msg.delivererPersonId)?.fullName ?? "Fiancé(e)"
    case "guest":        return guests.find((x) => x.id === msg.delivererGuestId)?.fullName ?? "Inconnu"
    default:             return msg.delivererGuestId ? (guests.find((x) => x.id === msg.delivererGuestId)?.fullName ?? "Inconnu") : ""
  }
}

// ── Formulaire ────────────────────────────────────────────────────────────────

interface FormState {
  stepId: string
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
  return {
    stepId: "", subject: "", content: "", scheduledTime: "",
    deliveryMode: "", delivererType: "", delivererGuestId: "", delivererPersonId: "",
    recipientType: "", recipientGuestId: "", recipientPersonId: "", recipientLabel: "",
  }
}

function msgToForm(msg: RosMessage): FormState {
  return {
    stepId: msg.stepId,
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

// ── Dialog ────────────────────────────────────────────────────────────────────

interface MessageDialogProps {
  open: boolean
  onClose: () => void
  editing?: RosMessage
  steps: RunOfShowStep[]
  guests: Guest[]
  people: Person[]
  allMessages: RosMessage[]
}

function MessageDialog({ open, onClose, editing, steps, guests, people, allMessages }: MessageDialogProps) {
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

  const { prep, program } = splitRunOfShowSteps(steps)
  const sortedSteps = [...prep, ...program]
  const assignableGuests = guests.filter((g) => g.assignable)
  const canSubmit = form.content.trim().length > 0 && form.stepId !== ""
  const isPending = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextOrder = allMessages.filter((m) => m.stepId === form.stepId).length
    const payload: RosMessageInput = {
      stepId: form.stepId,
      sortOrder: editing?.sortOrder ?? nextOrder,
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
      await create.mutateAsync(payload)
      toast.success("Message créé.")
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="flex flex-col sm:max-w-lg max-h-[90svh]">
        <DialogHeader>
          <DialogTitle className="font-heading">{editing ? "Modifier le message" : "Nouveau message"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 gap-4">
          <div className="overflow-y-auto space-y-4 pr-1">
            <FieldGroup>

              {/* Étape parente */}
              <Field>
                <FieldLabel>Étape du déroulé *</FieldLabel>
                <Select
                  value={form.stepId || "__none__"}
                  onValueChange={(v) => set("stepId", v === "__none__" ? "" : v)}
                  disabled={!!editing}
                >
                  <SelectTrigger><SelectValue placeholder="Associer à une étape…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Choisir une étape</SelectItem>
                    {sortedSteps.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.timeLabel} · {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

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
                    { value: "micro", label: "Au micro", Icon: Mic },
                    { value: "discret", label: "Discrètement", Icon: EarOff },
                  ] as const).map((opt) => {
                    const Icon = "Icon" in opt ? opt.Icon : null
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

// ── Carte message ─────────────────────────────────────────────────────────────

function MessageCard({ msg, step, guests, people, onEdit }: {
  msg: RosMessage
  step?: RunOfShowStep
  guests: Guest[]
  people: Person[]
  onEdit: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const deleteMsg = useDeleteRosMessage()

  const dLabel  = delivererLabel(msg, guests, people)
  const rLabel  = recipientLabel(msg, guests, people)

  return (
    <div className="group rounded-xl border border-border bg-card px-4 py-3 space-y-2">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {step && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {step.timeLabel} · {step.label}
            </span>
          )}
          {msg.scheduledTime && (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{msg.scheduledTime}</span>
          )}
          {msg.deliveryMode === "micro" && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-bordeaux/10 px-2 py-0.5 text-[10px] font-semibold text-bordeaux">
              <Mic className="size-3" />Micro
            </span>
          )}
          {msg.deliveryMode === "discret" && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-lagon/10 px-2 py-0.5 text-[10px] font-semibold text-lagon">
              <EarOff className="size-3" />Discret
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
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

      {/* Sujet + contenu */}
      {msg.subject && <p className="text-sm font-medium text-foreground">{msg.subject}</p>}
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{msg.content}</p>

      {/* Métadonnées */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {dLabel && (
          <span className="flex items-center gap-1">
            <Send className="size-3 shrink-0" />
            <span className="font-medium text-foreground">{dLabel}</span>
          </span>
        )}
        {msg.recipientType && (
          <span className="flex items-center gap-1">
            {(msg.recipientType === "both_fiances" || msg.recipientType === "all_guests")
              ? <Users className="size-3 shrink-0" />
              : <User className="size-3 shrink-0" />}
            <span className="font-medium text-foreground">{rLabel}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function MessagesManager() {
  const { data: steps    = [], isLoading: l1 } = useRunOfShow()
  const { data: messages = [], isLoading: l2 } = useRosMessages()
  const { data: guests   = [] } = useGuests()
  const { data: people   = [] } = usePeople()
  const isLoading = l1 || l2

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing,    setEditing]    = useState<RosMessage | undefined>()

  const { prep, program } = splitRunOfShowSteps(steps)
  const sortedSteps = [...prep, ...program]
  const stepMap = new Map(sortedSteps.map((s) => [s.id, s]))

  const sorted = [...messages].sort((a, b) => {
    const sA = stepMap.get(a.stepId)
    const sB = stepMap.get(b.stepId)
    const tA = sA?.startsAt ? new Date(sA.startsAt).getTime() : sortableTime(sA?.timeLabel ?? "")
    const tB = sB?.startsAt ? new Date(sB.startsAt).getTime() : sortableTime(sB?.timeLabel ?? "")
    if (tA !== tB) return tA - tB
    if (a.scheduledTime && b.scheduledTime) return sortableTime(a.scheduledTime) - sortableTime(b.scheduledTime)
    if (a.scheduledTime) return -1
    if (b.scheduledTime) return 1
    return a.sortOrder - b.sortOrder
  })

  function openCreate() { setEditing(undefined); setDialogOpen(true) }
  function openEdit(msg: RosMessage) { setEditing(msg); setDialogOpen(true) }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="size-4" />
          <span>{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Nouveau message
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Aucun message configuré. Cliquez sur « Nouveau message » pour commencer.
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              step={stepMap.get(msg.stepId)}
              guests={guests}
              people={people}
              onEdit={() => openEdit(msg)}
            />
          ))}
        </div>
      )}

      <MessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editing={editing}
        steps={sortedSteps}
        guests={guests}
        people={people}
        allMessages={messages}
      />
    </div>
  )
}
