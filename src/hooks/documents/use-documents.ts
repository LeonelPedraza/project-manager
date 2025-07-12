import { createDocument, getDocuments } from "@/services/documents/document"
import type { Document } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const PROJECT_DOCUMETS_QUERY_KEY = 'project-documents'

export const useDocuments = (projectId: string) => {

    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery<Document[]>({
        queryKey: [PROJECT_DOCUMETS_QUERY_KEY, projectId],
        queryFn: () => getDocuments({ projectId: projectId ?? '' }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const addDocument = useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECT_DOCUMETS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error creating folder:', error.message)
            return error
        }
    })

    return {
        documents: data,
        isLoading,
        addDocument
    }
}