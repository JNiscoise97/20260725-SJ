export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`
}

export function whatsappLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`
}

export function smsLink(phone: string): string {
  return `sms:${phone.replace(/\s+/g, "")}`
}
