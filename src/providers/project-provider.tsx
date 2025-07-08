import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { ProjectContext } from '@/context/project-context'
import type { Project } from '@/types/types'
import { supabase } from '@/supabase/supabase'

interface ProjectProvider {
    projectId: string
    children: ReactNode
}

export const ProjectProvider = ({ projectId, children }: ProjectProvider) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [selectedProjectPermissions, setSelectedProjectPermissions] = useState<Set<string>>(new Set<string>())

    /**
     * Obtiene el projecto seleccionado
     * @returns {Promise<Project | null>} El proyecto obtenido o null si no se pudo obtener.
     */
    const getProject = useCallback(async () => { 
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
    }, [projectId])

    /**
     * Obtiene los permisos del usuario actual para un proyecto dado.
     * @returns {Promise<Set<string>>} Un Set con los nombres de los permisos.
     */
    const getUserPermissionsForProject = useCallback(async () => {
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
    }, [projectId])

    useEffect(() => {
        if (projectId) {
            getProject().then(setSelectedProject)
            getUserPermissionsForProject().then(setSelectedProjectPermissions)
        }
    }, [getProject, getUserPermissionsForProject, projectId])

    const value = {
        selectedProject,
        setSelectedProject,
        selectedProjectPermissions,
        setSelectedProjectPermissions,
    }

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    )
}