const SEED_FLAG_PREFIX = "sj-mock-seeded:"

function readTable<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T[]) : []
}

function writeTable<T>(key: string, rows: T[]) {
  localStorage.setItem(key, JSON.stringify(rows))
}

interface MockRow {
  id: string
}

export function createMockTable<T extends MockRow>(key: string, seed: T[]) {
  const seedFlag = `${SEED_FLAG_PREFIX}${key}`
  if (!localStorage.getItem(seedFlag)) {
    writeTable(key, seed)
    localStorage.setItem(seedFlag, "1")
  }

  return {
    async getAll(): Promise<T[]> {
      return readTable<T>(key)
    },
    async getById(id: string): Promise<T | null> {
      return readTable<T>(key).find((row) => row.id === id) ?? null
    },
    async insert(row: T): Promise<T> {
      const rows = readTable<T>(key)
      rows.push(row)
      writeTable(key, rows)
      return row
    },
    async update(id: string, patch: Partial<T>): Promise<T> {
      const rows = readTable<T>(key)
      const index = rows.findIndex((row) => row.id === id)
      if (index === -1) throw new Error(`${key}: ligne ${id} introuvable`)
      rows[index] = { ...rows[index], ...patch }
      writeTable(key, rows)
      return rows[index]
    },
    async remove(id: string): Promise<void> {
      writeTable(key, readTable<T>(key).filter((row) => row.id !== id))
    },
  }
}
