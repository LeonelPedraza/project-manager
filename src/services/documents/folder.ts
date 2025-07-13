import type { DriveItemType } from "@/lib/enums/drive-item-type"
import { supabase } from "@/supabase/supabase"
import type { Folder } from "@/types/types"

export const getFolders = async ({projectId}: {projectId: string}) => {
    try {
        const { data, error } = await supabase
            .from('folders')
            .select(`
                id,
                name,
                parent_folder_id,
                drive_folder_id,
                project_id
            `)
            .eq('project_id', projectId)
            .order('name', { ascending: true })
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Folder[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder fetching.')
    }
}

export interface CreateFolder {
    folderName: string
    parentFolderId?: string | null
    projectId: string
}
export const createFolder = async (folderData: CreateFolder) => {
    try {
        const { data, error } = await supabase.functions.invoke('create-folder', {
            body: folderData
        })
        if (error) {
            throw Error(error.message)
        }
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder creating.')
    }
}

interface RenameFolder {
    newName: string
    driveItemId: string
    itemType: DriveItemType
}
export const rename_drive_item = async ({ newName, driveItemId, itemType }: RenameFolder) => {
    try {
        const { error } = await supabase.functions.invoke('rename-drive-item', {
            body: {
                newName,
                driveItemId,
                itemType
            }
        })
        if (error) {
            throw Error(error.message)
        }
        return itemType
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder renaming.')
    }
}

interface MoveFolder {
    driveItemId: string
    parentFolderId: string | null
    projectId: string
    itemType: DriveItemType
}
export const move_drive_item = async ({ driveItemId, parentFolderId, projectId, itemType }: MoveFolder) => {
    try {
        const { error } = await supabase.functions.invoke('move-drive-item', {
            body: {
                fileId: driveItemId,
                parentFolderId,
                projectId,
                itemType
            }
        })
        if (error) {
            throw Error(error.message)
        }
        return itemType
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder moving.')
    }
}

interface RemoveFolder {
    driveItemId: string
    itemType: DriveItemType
}
export const delete_drive_item = async ({ driveItemId, itemType }: RemoveFolder) => {
    try {
        const { error } = await supabase.functions.invoke('delete-drive-item', {
            body: {
                driveItemId,
                itemType
            }
        })
        if (error) {
            throw Error(error.message)
        }
        return itemType
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder renaming.')
    }
}