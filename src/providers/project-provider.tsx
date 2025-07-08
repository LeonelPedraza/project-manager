import { useEffect, useState, type ReactNode } from 'react'
import { ProjectContext } from '@/context/project-context'
import type { Project } from '@/types/types'
import { getProject, getUserPermissionsForProject } from '@/services/project'

interface ProjectProvider {
    projectId: string
    children: ReactNode
}

export const ProjectProvider = ({ projectId, children }: ProjectProvider) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [selectedProjectPermissions, setSelectedProjectPermissions] = useState<Set<string>>(new Set<string>())

    useEffect(() => {
        if (projectId) {
            getProject({ projectId }).then(setSelectedProject)
            getUserPermissionsForProject({ projectId }).then(setSelectedProjectPermissions)
        }
    }, [projectId])

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