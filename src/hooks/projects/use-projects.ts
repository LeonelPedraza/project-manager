import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createProject, deleteProject, getProjects, updateProject } from "@/services/project"
import type { Projects } from "@/types/types"

export const PROJECTS_QUERY_KEY = 'projects'

export const useProjects = () => { 
    
    const queryClient = useQueryClient()

    const { data, isLoading, isError, error } = useQuery<Projects[]>({
        queryKey: [PROJECTS_QUERY_KEY],
        queryFn: getProjects,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const addProject = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] })
        },
        onError: (error) => {
            console.error('Error creating project:', error.message)
        }
    })

    const modifyProject = useMutation({
        mutationFn: updateProject,
        onSuccess: (updatedProject) => {
            queryClient.setQueryData([PROJECTS_QUERY_KEY], (oldProjects: Projects[]) => {
                return oldProjects.map((item) => 
                    item.project.id === updatedProject?.id ? 
                        {
                            ...item,
                            project: updatedProject
                        } : 
                        item 
                    )
            })
        },
        onError: (error) => {
            console.error('Error updating project:', error.message)
        }
    })

    const removeProject = useMutation({
        mutationFn: deleteProject,
        onSuccess: (deletedProjectId) => {
            queryClient.setQueryData([PROJECTS_QUERY_KEY], (oldProjects: Projects[]) => {
                return oldProjects.filter(({project}) => project.id !== deletedProjectId)
            })
        },
        onError: (error) => {
            console.error('Error deleting project:', error.message)
        }
    })

    return {
        projects: data || [],
        isLoading,
        isError,
        error,
        addProject,
        modifyProject,
        removeProject,
    }

}