import type { RosMessage, RosRecipientType } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { supabase, USE_SUPABASE } from "@/supabase/client"

const mock = createMockTable<RosMessage>("sj-ros-messages", [])

function rowToMsg(r: {
  id: string; step_id: string; subject: string | null; content: string
  sort_order: number; sent_at: string | null; deliverer_guest_id: string | null
  recipient_type: string | null; recipient_guest_id: string | null
  recipient_person_id: string | null; recipient_label: string | null
  scheduled_time: string | null
}): RosMessage {
  return {
    id: r.id,
    stepId: r.step_id,
    subject: r.subject,
    content: r.content,
    sortOrder: r.sort_order,
    sentAt: r.sent_at,
    delivererGuestId: r.deliverer_guest_id,
    recipientType: r.recipient_type as RosRecipientType | null,
    recipientGuestId: r.recipient_guest_id,
    recipientPersonId: r.recipient_person_id,
    recipientLabel: r.recipient_label,
    scheduledTime: r.scheduled_time,
  }
}

export interface RosMessageInput {
  stepId: string
  subject?: string | null
  content: string
  sortOrder?: number
  delivererGuestId?: string | null
  recipientType?: RosRecipientType | null
  recipientGuestId?: string | null
  recipientPersonId?: string | null
  recipientLabel?: string | null
  scheduledTime?: string | null
}

export interface RosMessagePatch {
  subject?: string | null
  content?: string
  sentAt?: string | null
  sortOrder?: number
  delivererGuestId?: string | null
  recipientType?: RosRecipientType | null
  recipientGuestId?: string | null
  recipientPersonId?: string | null
  recipientLabel?: string | null
  scheduledTime?: string | null
}

export const rosMessagesService = {
  async list(): Promise<RosMessage[]> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_messages")
        .select("*")
        .order("sort_order")
      if (error) throw error
      return (data ?? []).map(rowToMsg)
    }
    return mock.getAll()
  },

  async create(input: RosMessageInput): Promise<RosMessage> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase!
        .from("_20260725_ros_messages")
        .insert({
          step_id: input.stepId,
          subject: input.subject ?? null,
          content: input.content,
          sort_order: input.sortOrder ?? 0,
          deliverer_guest_id: input.delivererGuestId ?? null,
          recipient_type: input.recipientType ?? null,
          recipient_guest_id: input.recipientGuestId ?? null,
          recipient_person_id: input.recipientPersonId ?? null,
          recipient_label: input.recipientLabel ?? null,
          scheduled_time: input.scheduledTime ?? null,
        })
        .select()
        .single()
      if (error) throw error
      return rowToMsg(data)
    }
    const msg: RosMessage = {
      id: crypto.randomUUID(),
      stepId: input.stepId,
      subject: input.subject ?? null,
      content: input.content,
      sortOrder: input.sortOrder ?? 0,
      sentAt: null,
      delivererGuestId: input.delivererGuestId ?? null,
      recipientType: input.recipientType ?? null,
      recipientGuestId: input.recipientGuestId ?? null,
      recipientPersonId: input.recipientPersonId ?? null,
      recipientLabel: input.recipientLabel ?? null,
      scheduledTime: input.scheduledTime ?? null,
    }
    return mock.insert(msg)
  },

  async update(id: string, patch: RosMessagePatch): Promise<void> {
    if (USE_SUPABASE) {
      const dbPatch: Record<string, unknown> = {}
      if ("subject" in patch) dbPatch.subject = patch.subject
      if (patch.content !== undefined) dbPatch.content = patch.content
      if ("sentAt" in patch) dbPatch.sent_at = patch.sentAt
      if (patch.sortOrder !== undefined) dbPatch.sort_order = patch.sortOrder
      if ("delivererGuestId" in patch) dbPatch.deliverer_guest_id = patch.delivererGuestId
      if ("recipientType" in patch) dbPatch.recipient_type = patch.recipientType
      if ("recipientGuestId" in patch) dbPatch.recipient_guest_id = patch.recipientGuestId
      if ("recipientPersonId" in patch) dbPatch.recipient_person_id = patch.recipientPersonId
      if ("recipientLabel" in patch) dbPatch.recipient_label = patch.recipientLabel
      if ("scheduledTime" in patch) dbPatch.scheduled_time = patch.scheduledTime
      const { error } = await supabase!.from("_20260725_ros_messages").update(dbPatch).eq("id", id)
      if (error) throw error
      return
    }
    const mockPatch: Partial<RosMessage> = {}
    if ("subject" in patch) mockPatch.subject = patch.subject ?? null
    if (patch.content !== undefined) mockPatch.content = patch.content
    if ("sentAt" in patch) mockPatch.sentAt = patch.sentAt ?? null
    if (patch.sortOrder !== undefined) mockPatch.sortOrder = patch.sortOrder
    if ("delivererGuestId" in patch) mockPatch.delivererGuestId = patch.delivererGuestId ?? null
    if ("recipientType" in patch) mockPatch.recipientType = patch.recipientType ?? null
    if ("recipientGuestId" in patch) mockPatch.recipientGuestId = patch.recipientGuestId ?? null
    if ("recipientPersonId" in patch) mockPatch.recipientPersonId = patch.recipientPersonId ?? null
    if ("recipientLabel" in patch) mockPatch.recipientLabel = patch.recipientLabel ?? null
    if ("scheduledTime" in patch) mockPatch.scheduledTime = patch.scheduledTime ?? null
    await mock.update(id, mockPatch)
  },

  async remove(id: string): Promise<void> {
    if (USE_SUPABASE) {
      const { error } = await supabase!.from("_20260725_ros_messages").delete().eq("id", id)
      if (error) throw error
      return
    }
    await mock.remove(id)
  },
}
