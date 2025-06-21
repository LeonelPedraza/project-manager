import { supabase } from "@/providers/supabase"
import type { Project } from "@/types/types"


export const getProjects = async (): Promise<Project[]> => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                id,
                name,
                description,
                project_type,
                favorite,
                user_id,
                profiles (id, username, avatar_url)
            `)
            .order('start_date', { ascending: false })
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Project[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
        return []
    }
}

export const createProject = async ({ name, description, project_type }: Partial<Project>) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert({
                name,
                description,
                project_type,
            })
            .select(`
                id,
                name,
                description,
                project_type,
                favorite,
                user_id,
                profiles (id, username, avatar_url)
            `)
        if (error) {
            throw Error(error.message)
        }
        return data[0]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}

export const updateProject = async ({ id, updateFields }: { id: string, updateFields: Partial<Project> }) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .update(updateFields)
            .eq('id', id)
            .select(`
                id,
                name,
                description,
                project_type,
                favorite,
                user_id,
                profiles (id, username, avatar_url)
            `)
        if (error) {
            throw Error(error.message)
        }
        return data[0]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}

export const deleteProject = async ({ id }: { id: string }) => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
        if (error) {
            throw Error(error.message)
        }
        return id
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}