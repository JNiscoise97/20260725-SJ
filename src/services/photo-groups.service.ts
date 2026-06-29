import type { PhotoGroup, PhotoGroupMember } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { photoGroupsSeed, photoGroupMembersSeed } from "@/services/mock/data/photo-groups"
import { photoGroupsSupabaseService } from "@/services/supabase/photo-groups"
import { USE_SUPABASE } from "@/supabase/client"

export interface PhotoGroupsService {
  listGroups(): Promise<PhotoGroup[]>
  createGroup(input: Omit<PhotoGroup, "id">): Promise<PhotoGroup>
  updateGroup(id: string, patch: Partial<PhotoGroup>): Promise<PhotoGroup>
  removeGroup(id: string): Promise<void>
  listAllMembers(): Promise<PhotoGroupMember[]>
  addMember(photoGroupId: string, guestId: string): Promise<PhotoGroupMember>
  removeMember(id: string): Promise<void>
  updateMember(id: string, patch: Partial<PhotoGroupMember>): Promise<PhotoGroupMember>
}

const photoGroupsTable = createMockTable<PhotoGroup>("sj-photo-groups", photoGroupsSeed)
const photoGroupMembersTable = createMockTable<PhotoGroupMember>("sj-photo-group-members", photoGroupMembersSeed)

const photoGroupsMockService: PhotoGroupsService = {
  async listGroups() {
    return photoGroupsTable.getAll()
  },
  async createGroup(input) {
    return photoGroupsTable.insert({ ...input, id: crypto.randomUUID() })
  },
  async updateGroup(id, patch) {
    return photoGroupsTable.update(id, patch)
  },
  async removeGroup(id) {
    const members = await photoGroupMembersTable.getAll()
    await Promise.all(members.filter((m) => m.photoGroupId === id).map((m) => photoGroupMembersTable.remove(m.id)))
    await photoGroupsTable.remove(id)
  },
  async listAllMembers() {
    return photoGroupMembersTable.getAll()
  },
  async addMember(photoGroupId, guestId) {
    return photoGroupMembersTable.insert({ id: crypto.randomUUID(), photoGroupId, guestId, isPresent: false })
  },
  async removeMember(id) {
    await photoGroupMembersTable.remove(id)
  },
  async updateMember(id, patch) {
    return photoGroupMembersTable.update(id, patch)
  },
}

export const photoGroupsService: PhotoGroupsService = USE_SUPABASE
  ? photoGroupsSupabaseService
  : photoGroupsMockService
