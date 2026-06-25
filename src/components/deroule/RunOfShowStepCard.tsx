import { motion } from "framer-motion"
import { Clock, MapPin, Music, User } from "lucide-react"

import type { Person, RunOfShowStep } from "@/types/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RunOfShowStepCardProps {
  step: RunOfShowStep
  responsibles: Person[]
}

export function RunOfShowStepCard({ step, responsibles }: RunOfShowStepCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      className="flex gap-4"
    >
      <div className="flex w-20 shrink-0 flex-col items-center">
        <span className="font-heading text-lg font-semibold text-bordeaux">{step.timeLabel}</span>
        <span className="mt-1 h-full w-px bg-border" />
      </div>
      <Card className="flex-1">
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading text-lg font-medium text-foreground">{step.label}</p>
            {step.phase ? <Badge className="bg-dore/20 text-brun">{step.phase}</Badge> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {step.durationMinutes ? (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {step.durationMinutes} min
              </span>
            ) : null}
            {step.location ? (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {step.location}
              </span>
            ) : null}
            {responsibles.map((person) => (
              <span key={person.id} className="flex items-center gap-1">
                <User className="size-3.5" />
                {person.fullName}
              </span>
            ))}
          </div>
          {step.music ? (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Music className="mt-0.5 size-3.5 shrink-0" />
              {step.music}
            </p>
          ) : null}
          {step.notes ? <p className="text-xs italic text-muted-foreground">{step.notes}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
