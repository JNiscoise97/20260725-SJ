import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { documentsService } from "@/services/documents.service"
import type { DocumentItem } from "@/types/domain"

const DOCUMENTS_KEY = ["documents"] as const

export function useDocuments() {
  return useQuery({ queryKey: DOCUMENTS_KEY, queryFn: () => documentsService.list() })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<DocumentItem, "id">) => documentsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DOCUMENTS_KEY }),
  })
}
