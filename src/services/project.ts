import { supabase } from "@/supabase/supabase"
import type { Project, Projects } from "@/types/types"


export const getProjects = async (): Promise<Projects[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
            .from('members')
            .select(`
                projects (id, name, description, project_type, favorite, owner:profiles(username, avatar_url)),
                roles (name),
                profiles (username, avatar_url)
            `)
            .eq('profile_id', user?.id)
            .order('created_at', { ascending: false })
        if (error) {
            throw Error(error.message)
        }
        const res = data.map(item => {
            return {
                project: item.projects,
                role: item.roles,
                profile: item.profiles
            }
        })
        return res as unknown as Projects[]
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
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
            .from('projects')
            .insert({
                owner_id: user?.id,
                name,
                description,
                project_type,
            })
        if (error) {
            throw Error(error.message)
        }
        return
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
                favorite
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