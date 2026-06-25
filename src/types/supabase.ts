// Database type écrit à la main, en miroir des migrations dans src/supabase/migrations/.
// À remplacer par `supabase gen types typescript` une fois un vrai projet connecté
// (les noms de colonnes/tables ci-dessous doivent alors rester identiques).

type WithDefaults<Row, OptionalKeys extends keyof Row> = Omit<Row, OptionalKeys> &
  Partial<Pick<Row, OptionalKeys>>

type TableDef<Row, OptionalOnInsert extends keyof Row> = {
  Row: Row
  Insert: WithDefaults<Row, OptionalOnInsert>
  Update: Partial<WithDefaults<Row, OptionalOnInsert>>
}

export type AppRoleRow = "fiance" | "referent" | "proche" | "invite"
export type ProgressStatusRow = "todo" | "in_progress" | "done" | "blocked"
export type TaskPriorityRow = "low" | "normal" | "high" | "urgent"
export type PlanningMilestoneRow = "j_moins_30" | "j_moins_15" | "j_moins_7" | "j_moins_1" | "jour_j" | "j_plus_1"
export type RsvpStatusRow = "pending" | "confirmed" | "declined"
export type NotificationChannelRow = "push" | "email" | "sms" | "whatsapp"
export type NotificationStatusRow = "pending" | "sent" | "failed"

interface RoleCategoryRow {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  sort_order: number
  created_at: string
}

interface PersonRow {
  id: string
  full_name: string
  phone: string | null
  role: AppRoleRow
  access_code_hash: string
  referent_category_id: string | null
  partner_referent_id: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

interface AppSettingsRow {
  id: "singleton"
  event_name: string
  event_date: string
  day_of_override: string | null
  updated_at: string
}

interface MissionRow {
  id: string
  role_category_id: string | null
  referent_id: string | null
  title: string
  description: string | null
  status: ProgressStatusRow
  created_at: string
  updated_at: string
}

interface TaskRow {
  id: string
  mission_id: string | null
  title: string
  description: string | null
  priority: TaskPriorityRow
  status: ProgressStatusRow
  category: string | null
  due_date: string | null
  due_time: string | null
  owner_id: string | null
  created_at: string
  updated_at: string
}

interface ChecklistRow {
  id: string
  owner_type: "referent" | "mission" | "logistique_item"
  owner_id: string
  title: string
  created_at: string
}

interface ChecklistItemRow {
  id: string
  checklist_id: string
  label: string
  is_done: boolean
  sort_order: number
  done_by: string | null
  done_at: string | null
}

interface PlanningEventRow {
  id: string
  milestone: PlanningMilestoneRow
  title: string
  description: string | null
  location: string | null
  starts_at: string | null
  ends_at: string | null
  sort_order: number
  created_at: string
}

interface RunOfShowStepRow {
  id: string
  time_label: string
  starts_at: string | null
  label: string
  duration_minutes: number | null
  location: string | null
  sort_order: number
  created_at: string
}

interface RunOfShowResponsibleRow {
  run_of_show_step_id: string
  person_id: string
}

interface LogistiqueItemRow {
  id: string
  role_category_id: string | null
  name: string
  responsable_id: string | null
  quantity: number | null
  unit: string | null
  notes: string | null
  created_at: string
}

interface GuestGroupRow {
  id: string
  family_name: string
  notes: string | null
}

interface GuestRow {
  id: string
  group_id: string | null
  full_name: string
  phone: string | null
  email: string | null
  rsvp_status: RsvpStatusRow
  dietary_constraints: string | null
  plus_one: boolean
  created_at: string
}

interface TableRow {
  id: string
  name: string
  capacity: number
}

interface TableAssignmentRow {
  id: string
  table_id: string
  guest_id: string
  seat_number: number | null
}

interface AttachmentRow {
  id: string
  entity_type: string | null
  entity_id: string | null
  file_path: string
  file_name: string
  mime_type: string | null
  uploaded_by: string | null
  created_at: string
}

interface DocumentRow {
  id: string
  attachment_id: string
  title: string
  category: string | null
  visible_to_roles: AppRoleRow[]
  created_at: string
}

interface CommentRow {
  id: string
  entity_type: string
  entity_id: string
  author_id: string | null
  body: string
  created_at: string
}

interface NotificationRow {
  id: string
  recipient_id: string | null
  channel: NotificationChannelRow
  title: string
  body: string | null
  related_entity_type: string | null
  related_entity_id: string | null
  status: NotificationStatusRow
  created_at: string
  sent_at: string | null
}

interface NotificationLogRow {
  id: string
  notification_id: string
  attempted_at: string
  result: string
  error_message: string | null
}

export interface Database {
  public: {
    Tables: {
      role_categories: TableDef<RoleCategoryRow, "id" | "icon" | "color" | "sort_order" | "created_at">
      people: TableDef<
        PersonRow,
        "id" | "phone" | "referent_category_id" | "partner_referent_id" | "avatar_url" | "is_active" | "created_at"
      >
      app_settings: TableDef<AppSettingsRow, "id" | "day_of_override" | "updated_at">
      missions: TableDef<
        MissionRow,
        "id" | "role_category_id" | "referent_id" | "description" | "status" | "created_at" | "updated_at"
      >
      tasks: TableDef<
        TaskRow,
        | "id"
        | "mission_id"
        | "description"
        | "priority"
        | "status"
        | "category"
        | "due_date"
        | "due_time"
        | "owner_id"
        | "created_at"
        | "updated_at"
      >
      checklists: TableDef<ChecklistRow, "id" | "created_at">
      checklist_items: TableDef<ChecklistItemRow, "id" | "is_done" | "sort_order" | "done_by" | "done_at">
      planning_events: TableDef<
        PlanningEventRow,
        "id" | "description" | "location" | "starts_at" | "ends_at" | "sort_order" | "created_at"
      >
      run_of_show_steps: TableDef<
        RunOfShowStepRow,
        "id" | "starts_at" | "duration_minutes" | "location" | "sort_order" | "created_at"
      >
      run_of_show_responsibles: TableDef<RunOfShowResponsibleRow, never>
      logistique_items: TableDef<
        LogistiqueItemRow,
        "id" | "role_category_id" | "responsable_id" | "quantity" | "unit" | "notes" | "created_at"
      >
      guest_groups: TableDef<GuestGroupRow, "id" | "notes">
      guests: TableDef<
        GuestRow,
        "id" | "group_id" | "phone" | "email" | "rsvp_status" | "dietary_constraints" | "plus_one" | "created_at"
      >
      tables: TableDef<TableRow, "id">
      table_assignments: TableDef<TableAssignmentRow, "id" | "seat_number">
      attachments: TableDef<
        AttachmentRow,
        "id" | "entity_type" | "entity_id" | "mime_type" | "uploaded_by" | "created_at"
      >
      documents: TableDef<DocumentRow, "id" | "category" | "visible_to_roles" | "created_at">
      comments: TableDef<CommentRow, "id" | "author_id" | "created_at">
      notifications: TableDef<
        NotificationRow,
        "id" | "recipient_id" | "body" | "related_entity_type" | "related_entity_id" | "status" | "created_at" | "sent_at"
      >
      notification_log: TableDef<NotificationLogRow, "id" | "attempted_at" | "error_message">
    }
  }
}
