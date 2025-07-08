import { supabase } from "@/supabase/supabase"
import type { Project, Projects } from "@/types/types"

export const getProject = async ({ projectId }: { projectId: string }) => {
    try {
        const { data: projectData, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()

        if (error) {
            console.error('Error al obtener el proyecto:', error.message);
            return null;
        }

        if (projectData) {
            return projectData as Project;
        }
        return null
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al obtener el proyecto:', error.message);
        } else {
            console.error('Error al obtener el proyecto:', error);
        }
        return null;
    }
}

export const getProjects = async (): Promise<Projects[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
            .from('members')
            .select(`
                projects (id, name, description, project_type, favorite, owner:profiles(username, avatar_url)),
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
                profile: item.profiles
            }
        })
        return res as unknown as Projects[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
        throw new Error('An unknown error occurred during project fetching.')
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
        }
        throw new Error('An unknown error occurred during project creation.')
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
        }
        throw new Error('An unknown error occurred during project update.')
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
        }
        throw new Error('An unknown error occurred during project deletion.')
    }
}

export const getUserPermissionsForProject = async ({ projectId }: { projectId: string }) => {
    const { data: userSession } = await supabase.auth.getSession();
    const userId = userSession?.session?.user?.id;

    if (!userId) {
        console.warn('Usuario no autenticado. No se pueden obtener permisos.');
        return new Set<string>(); // Retorna un Set vacío si no hay usuario
    }

    try {
        // Llama a tu función RPC de PostgreSQL
        const { data: permissions, error } = await supabase.rpc('get_profile_project_permissions', {
            p_profile_id: userId,
            p_project_id: projectId
        });

        if (error) {
            console.error('Error al obtener permisos:', error.message);
            return new Set<string>();
        }

        // `permissions` será un array de strings (ej. ['documents:read', 'tasks:create'])
        // Conviértelo a un Set para búsquedas de `has()` más eficientes
        return new Set<string>(permissions || []);

    } catch (err) {
        if (err instanceof Error) {
            console.error('Error al obtener permisos:', err.message);
        } else {
            console.error('Error al obtener permisos:', err);
        }
        return new Set<string>();
    }
}