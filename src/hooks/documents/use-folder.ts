import { createFolder, delete_drive_item, getFolders, move_drive_item, rename_drive_item } from "@/services/documents/folder"
import type { Folder } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PROJECT_DOCUMETS_QUERY_KEY } from "./use-documents"

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

    const renameDriveItem = useMutation({
        mutationFn: rename_drive_item,
        onSuccess: (response) => {
            console.log(response)
            if (response == 'folder') {
                queryClient.invalidateQueries({ queryKey: [PROJECT_FOLDERS_QUERY_KEY, projectId] })
            } else {
                queryClient.invalidateQueries({ queryKey: [PROJECT_DOCUMETS_QUERY_KEY, projectId] })
            }
        },
        onError: (error) => {
            console.error('Error renaming folder:', error.message)
            return error
        }
    })

    const moveDriveItem = useMutation({
        mutationFn: move_drive_item,
        onSuccess: (response) => {
            console.log(response)
            if (response == 'folder') {
                queryClient.invalidateQueries({ queryKey: [PROJECT_FOLDERS_QUERY_KEY, projectId] })
            } else {
                queryClient.invalidateQueries({ queryKey: [PROJECT_DOCUMETS_QUERY_KEY, projectId] })
            }
        },
        onError: (error) => {
            console.error('Error moving folder:', error.message)
            return error
        }
    })

    const removeDriveItem = useMutation({
        mutationFn: delete_drive_item,
        onSuccess: (response) => {
            console.log(response)
            if (response == 'folder') {
                queryClient.invalidateQueries({ queryKey: [PROJECT_FOLDERS_QUERY_KEY, projectId] })
            } else {
                queryClient.invalidateQueries({ queryKey: [PROJECT_DOCUMETS_QUERY_KEY, projectId] })
            }
        },
        onError: (error) => {
            console.error('Error renaming folder:', error.message)
            return error
        }
    })

    return {
        folders: data,
        isLoading,
        addFolder,
        renameDriveItem,
        moveDriveItem,
        removeDriveItem
    }

}