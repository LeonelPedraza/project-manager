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