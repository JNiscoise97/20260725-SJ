import type { Person } from "@/types/domain"
import { createMockTable } from "@/services/mock/db"
import { peopleSeed } from "@/services/mock/data/people"

export interface PeopleService {
  resolveByAccessCode(code: string): Promise<Person | null>
  getById(id: string): Promise<Person | null>
  list(): Promise<Person[]>
  create(person: Person): Promise<Person>
  update(id: string, patch: Partial<Person>): Promise<Person>
  remove(id: string): Promise<void>
}

// TODO(supabase): quand un projet Supabase existe, remplacer cette implémentation
// par un appel RPC `_20260725_resolve_access_code` (SECURITY DEFINER) pour ne jamais exposer
// access_code en lecture directe via la clé anon. Voir src/supabase/migrations/0009_rls_policies.sql.
const peopleTable = createMockTable<Person>("sj-people", peopleSeed)

export const peopleService: PeopleService = {
  async resolveByAccessCode(code) {
    const people = await peopleTable.getAll()
    const normalized = code.trim().toUpperCase()
    return (
      people.find((person) => person.isActive && person.accessCode.toUpperCase() === normalized) ?? null
    )
  },
  async getById(id) {
    return peopleTable.getById(id)
  },
  async list() {
    return peopleTable.getAll()
  },
  async create(person) {
    return peopleTable.insert(person)
  },
  async update(id, patch) {
    return peopleTable.update(id, patch)
  },
  async remove(id) {
    return peopleTable.remove(id)
  },
}
