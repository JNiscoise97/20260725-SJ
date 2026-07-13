import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Clock, MessageSquare, Pencil, Plus, Send, Trash2, User, Users, X } from "lucide-react"
import { toast } from "sonner"

import type { Guest, Person, RosMessage, RosRecipientType, RunOfShowStep } from "@/types/domain"
import type { RosMessageInput } from "@/services/ros-messages.service"
import { useCreateRosMessage, useDeleteRosMessage, useUpdateRosMessage } from "@/hooks/queries/use-ros-messages"
import { useGuests } from "@/hooks/queries/use-guests"
import { usePeople } from "@/hooks/queries/use-people"
import { buildPhaseSegments, splitRunOfShowSteps } from "@/lib/run-of-show"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ── Constantes ────────────────────────────────────────────────────────────────

const RECIPIENT_TYPES: { value: RosRecipientType; label: string }[] = [
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
    case "other": return msg.recipientLabel ?? "Autre"
  }
}

function delivererLabel(msg: RosMessage, guests: Guest[]): string {
  if (!msg.delivererGuestId) return ""
  return guests.find((x) => x.id === msg.delivererGuestId)?.fullName ?? "Inconnu"
}

// ── État du formulaire ────────────────────────────────────────────────────────

interface FormState {
  subject: string
  content: string
  scheduledTime: string
  delivererGuestId: string
  recipientType: RosRecipientType | ""
  recipientGuestId: string
  recipientPersonId: string
  recipientLabel: string
}

function emptyForm(): FormState {
  return { subject: "", content: "", scheduledTime: "", delivererGuestId: "", recipientType: "", recipientGuestId: "", recipientPersonId: "", recipientLabel: "" }
}

function msgToForm(msg: RosMessage): FormState {
  return {
    subject: msg.subject ?? "",
    content: msg.content,
    scheduledTime: msg.scheduledTime ?? "",
    delivererGuestId: msg.delivererGuestId ?? "",
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
      delivererGuestId: form.delivererGuestId || null,
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
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="msg-subject">Objet</FieldLabel>
                <Input id="msg-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Ex. Rappel DJ" />
              </Field>
              <Field>
                <FieldLabel htmlFor="msg-time">Heure (optionnel)</FieldLabel>
                <Input id="msg-time" type="time" value={form.scheduledTime} onChange={(e) => set("scheduledTime", e.target.value)} />
              </Field>
            </div>

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
              <Select value={form.delivererGuestId || "__none__"} onValueChange={(v) => set("delivererGuestId", v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un bénévole…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Non assigné</SelectItem>
                  {assignableGuests.map((g) => <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

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
                    {guests.map((g) => <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>)}
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

      <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {msg.delivererGuestId && (
          <span className="flex items-center gap-1">
            <Send className="size-3 shrink-0" />
            <span className="font-medium text-foreground">{delivererLabel(msg, guests)}</span>
          </span>
        )}
        {msg.recipientType && (
          <span className="flex items-center gap-1">
            {msg.recipientType === "both_fiances" ? <Users className="size-3 shrink-0" /> : <User className="size-3 shrink-0" />}
            <span className="font-medium text-foreground">{recipientLabel(msg, guests, people)}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ── Ligne d'étape ─────────────────────────────────────────────────────────────

function StepRow({ step, messages, guests, people }: {
  step: RunOfShowStep; messages: RosMessage[]; guests: Guest[]; people: Person[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RosMessage | undefined>(undefined)

  const stepMsgs = messages.filter((m) => m.stepId === step.id).sort((a, b) => a.sortOrder - b.sortOrder)

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
          {stepMsgs.length > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-dore">
              <MessageSquare className="size-3.5" />{stepMsgs.length}
            </span>
          )}
        </button>

        {expanded && (
          <div className="px-4 pb-4 pt-1 space-y-2 bg-muted/20">
            {stepMsgs.map((msg) => (
              <MessageCard key={msg.id} msg={msg} guests={guests} people={people}
                onEdit={() => { setEditing(msg); setDialogOpen(true) }} />
            ))}
            <button type="button"
              onClick={() => { setEditing(undefined); setDialogOpen(true) }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1">
              <Plus className="size-3.5" />Ajouter un message
            </button>
          </div>
        )}
      </div>

      <MessageDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
        stepId={step.id} sortOrder={stepMsgs.length}
        editing={editing} guests={guests} people={people} />
    </>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

interface Props {
  steps: RunOfShowStep[]
  messages: RosMessage[]
}

export function MessagesConfig({ steps, messages }: Props) {
  const { data: guests = [] } = useGuests()
  const { data: people = [] } = usePeople()

  const { prep, program } = splitRunOfShowSteps(steps)
  const allDated = [...prep, ...program]
  const segments = buildPhaseSegments(allDated).filter((s) => s.steps.length > 0)

  const totalMessages = messages.length
  const sentMessages = messages.filter((m) => m.sentAt !== null).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Configurés</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{totalMessages}</p>
        </div>
        <div className="rounded-xl border border-vert-vegetal/30 bg-vert-vegetal/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Envoyés</p>
          <p className="text-2xl font-bold tabular-nums text-vert-vegetal">{sentMessages}</p>
        </div>
        <div className="rounded-xl border border-dore/30 bg-dore/5 px-4 py-3">
          <p className="text-xs text-muted-foreground">Restants</p>
          <p className="text-2xl font-bold tabular-nums text-brun">{totalMessages - sentMessages}</p>
        </div>
      </div>

      {segments.map((seg, gi) => (
        <div key={gi} className="space-y-1">
          <div className="flex items-center gap-2 px-1">
            <span className={cn("size-2.5 rounded-full", seg.style.barClass)} />
            <h3 className="font-heading text-sm font-semibold text-foreground">{seg.style.label}</h3>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            {seg.steps.map((step) => (
              <StepRow key={step.id} step={step} messages={messages} guests={guests} people={people} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
