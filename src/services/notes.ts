import { supabase } from "@/supabase/supabase"
import type { Note } from "@/types/types"

export const getNotes = async ({projectId}: {projectId: string}) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select(`
                id,
                title,
                color,
                description,
                content
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: true })
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Note[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during note fetching.')
    }
}

export interface CreateNote {
    title: string
    color: string
    description: string
    content: object,
    project_id: string
    profile_id: string
}
export const createNote = async (note: CreateNote) => {
    try {
        const { data, error } = await supabase.from('notes').insert({...note})
        if (error) {
            throw Error(error.message)
        }
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during note creating.')
    }
}

export const updateNote = async (note: Partial<Note>) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .update(note)
            .eq('id', note.id)
            .select(`
                id,
                title,
                color,
                description,
                content
            `)
            .single()
        if (error) {
            throw Error(error.message)
        }
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during note updating.')
    }
}

export const removeNote = async ({ id }: { id: string }) => {
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
        if (error) {
            throw Error(error.message)
        }
        return id
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during note deletion.')
    }
}