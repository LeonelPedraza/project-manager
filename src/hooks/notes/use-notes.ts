import { createNote, getNotes, removeNote, updateNote } from "@/services/notes"
import type { Note } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const NOTES_QUERY_KEY = 'notes'

export const useNotes = (projectId: string) => {
    const queryClient = useQueryClient()

    const { data, isLoading, isError, error } = useQuery<Note[]>({
        queryKey: [NOTES_QUERY_KEY, projectId],
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

    const editNote = useMutation({
        mutationFn: updateNote,
        onSuccess: (updatedNote: Note) => {
            queryClient.setQueryData([NOTES_QUERY_KEY, projectId], (oldNotes: Note[]) => {
                return oldNotes.map((item) =>
                    item.id === updatedNote.id ?
                        {
                            ...updatedNote
                        } :
                        item
                )
            })
        },
        onError: (error) => {
            console.error('Error updating note:', error.message)
            return error
        }
    })

    const deleteNote = useMutation({
        mutationFn: removeNote,
        onSuccess: (deletedNoteId) => {
            queryClient.setQueryData([NOTES_QUERY_KEY, projectId], (oldNotes: Note[]) => {
                return oldNotes.filter(({id}) => id !== deletedNoteId)
            })
        },
        onError: (error) => {
            console.error('Error deleting note:', error.message)
        }
    })

    return {
        notes: data || [],
        addNote,
        editNote,
        deleteNote,
        isLoading,
        isError,
        error,
    }

}