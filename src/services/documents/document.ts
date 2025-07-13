import { supabase } from "@/supabase/supabase"
import type { Document } from "@/types/types"

export const getDocuments = async ({projectId}: {projectId: string}) => {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select(`
                id,
                name,
                file_type,
                drive_file_id,
                drive_file_url,
                parent_folder_id
            `)
            .eq('project_id', projectId)
            .order('name', { ascending: true })
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Document[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during folder fetching.')
    }
}

interface CreateDocument {
    documentName: string
    fileType: string
    parentFolderId?: string | null
    projectId: string
}
export const createDocument = async (folderData: CreateDocument) => {
    try {
        const { data, error } = await supabase.functions.invoke('create-document', {
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

interface CopyDocument {
    fileId: string
    fileName: string
    mimeType: string
    parentFolderId?: string
    projectId: string
}
export const copy_document = async (folderData: CopyDocument) => {
    try {
        const { data, error } = await supabase.functions.invoke('copy-document', {
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