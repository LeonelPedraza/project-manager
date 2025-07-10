import { createFolder, getFolders } from "@/services/documents"
import type { Folder } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const PROJECT_FOLDERS_QUERY_KEY = 'project-folders'

export const useFolder = (projectId: string) => {

    const queryClient = useQueryClient()

    const {  data, isLoading } = useQuery<Folder[]>({
        queryKey: [PROJECT_FOLDERS_QUERY_KEY, projectId],
        queryFn: () => getFolders({ projectId: projectId ?? '' }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const addFolder = useMutation({
        mutationFn: createFolder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECT_FOLDERS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error creating folder:', error.message)
            return error
        }
    })

    return {
        folders: data,
        isLoading,
        addFolder
    }

}