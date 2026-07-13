import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import type { RunOfShowStep } from "@/types/domain"
import { useCreateRosDelay } from "@/hooks/queries/use-ros-delays"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  currentStep: RunOfShowStep | null
}

export function DelayLogger({ currentStep }: Props) {
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState("10")
  const [reason, setReason] = useState("")
  const create = useCreateRosDelay()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const mins = parseInt(minutes, 10)
    if (isNaN(mins) || mins <= 0) return
    await create.mutateAsync({
      stepId: currentStep?.id ?? null,
      delayMinutes: mins,
      reason: reason.trim() || null,
    })
    toast.success(`Retard de ${mins} min signalé.`)
    setOpen(false)
    setMinutes("10")
    setReason("")
  }

  return (
    <div className="overflow-hidden rounded-xl border border-bordeaux/30 bg-bordeaux/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <AlertTriangle className="size-4 shrink-0 text-bordeaux" />
        <span className="flex-1 text-sm font-medium text-bordeaux">Signaler un retard</span>
        {open ? <ChevronUp className="size-4 text-bordeaux/60" /> : <ChevronDown className="size-4 text-bordeaux/60" />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-bordeaux/20 px-4 pb-4 pt-3">
          {currentStep && (
            <p className="text-xs text-muted-foreground">
              Étape : <span className="font-medium text-foreground">{currentStep.label}</span>
            </p>
          )}
          <div className="flex items-end gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Retard estimé (min)</label>
              <Input
                type="number"
                min={1}
                max={120}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-24 font-mono"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Raison (optionnel)</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex. cortège en retard, discours prolongé…"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={create.isPending} className="bg-bordeaux hover:bg-bordeaux/90">
              Signaler
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
