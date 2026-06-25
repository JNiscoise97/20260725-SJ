import { Link } from "react-router-dom"
import { Compass } from "lucide-react"

import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Page introuvable"
        description="Cette page n'existe pas ou plus."
        action={
          <Button asChild>
            <Link to="/">Retour au tableau de bord</Link>
          </Button>
        }
      />
    </div>
  )
}
