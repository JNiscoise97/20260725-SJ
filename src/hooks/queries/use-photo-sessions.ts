import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { photoSessionsService } from "@/services/photo-sessions.service"
import type { PhotoSession } from "@/types/domain"

const SESSIONS_KEY = ["photo-sessions"] as const
const GROUPS_KEY = ["photo-groups"] as const
const MEMBERS_KEY = ["photo-group-members"] as const

export function usePhotoSessions() {
  return useQuery({ queryKey: SESSIONS_KEY, queryFn: () => photoSessionsService.listSessions() })
}

export function useCreatePhotoSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<PhotoSession, "id">) => photoSessionsService.createSession(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  })
}

export function useUpdatePhotoSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PhotoSession> }) =>
      photoSessionsService.updateSession(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  })
}

/** Supprime la séance et cascade sur ses groupes/invités attendus — voir photo-sessions.service.ts. */
export function useDeletePhotoSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => photoSessionsService.removeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY })
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
    },
  })
}

/** Réordonnement par drag-and-drop : optimiste pour un retour visuel immédiat — même pattern que useReorderPhotoGroups. */
export function useReorderPhotoSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessions: PhotoSession[]) =>
      Promise.all(sessions.map((s) => photoSessionsService.updateSession(s.id, { sortOrder: s.sortOrder }))),
    onMutate: async (sessions) => {
      await queryClient.cancelQueries({ queryKey: SESSIONS_KEY })
      const previous = queryClient.getQueryData<PhotoSession[]>(SESSIONS_KEY)
      const byId = new Map(sessions.map((s) => [s.id, s]))
      queryClient.setQueryData<PhotoSession[]>(SESSIONS_KEY, (current) =>
        (current ?? []).map((s) => byId.get(s.id) ?? s)
      )
      return { previous }
    },
    onError: (_err, _sessions, context) => {
      if (context?.previous) queryClient.setQueryData(SESSIONS_KEY, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  })
}
