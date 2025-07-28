import { createNote, getNotes } from "@/services/notes"
import type { Note } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const NOTES_QUERY_KEY = 'notes'

export const useNotes = (projectId: string) => {
    const queryClient = useQueryClient()

    const { data, isLoading, isError, error } = useQuery<Note[]>({
        queryKey: [NOTES_QUERY_KEY],
        queryFn: () => getNotes({ projectId: projectId ?? '' }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const addNote = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] })
        },
        onError: (error) => {
            console.error('Error creating note:', error.message)
            return error
        }
    })

    return {
        notes: data || [],
        addNote,
        isLoading,
        isError,
        error,
    }

}