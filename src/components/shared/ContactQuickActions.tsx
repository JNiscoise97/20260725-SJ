import { Phone, MessageCircle, MessageSquareText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { telLink, whatsappLink, smsLink } from "@/lib/links"

export function ContactQuickActions({ phone }: { phone?: string | null }) {
  if (!phone) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <a href={telLink(phone)}>
          <Phone className="size-3.5" />
          Appeler
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={whatsappLink(phone)} target="_blank" rel="noreferrer">
          <MessageCircle className="size-3.5" />
          WhatsApp
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={smsLink(phone)}>
          <MessageSquareText className="size-3.5" />
          SMS
        </a>
      </Button>
    </div>
  )
}
