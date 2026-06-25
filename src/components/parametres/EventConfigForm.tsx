import { format } from "date-fns"
import { toast } from "sonner"

import { useEventConfig } from "@/context/EventConfigContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription, FieldGroup } from "@/components/ui/field"

export function EventConfigForm() {
  const { eventDate, daysUntilEvent, phase, setEventDate } = useEventConfig()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Date de l&apos;événement</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="event-date">Date des fiançailles</FieldLabel>
            <Input
              id="event-date"
              type="date"
              value={format(eventDate, "yyyy-MM-dd")}
              onChange={(e) => {
                setEventDate(e.target.value)
                toast.success("Date de l'événement mise à jour.")
              }}
            />
            <FieldDescription>
              Dans {daysUntilEvent} jour{Math.abs(daysUntilEvent) === 1 ? "" : "s"} · phase actuelle : {phase}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
