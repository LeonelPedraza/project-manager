import { createContext } from "react";
import type { Project } from "@/types/types";

interface ProjectContext {
    selectedProject: Project | null
    setSelectedProject: (project: Project) => void
    selectedProjectPermissions: Set<string>,
    setSelectedProjectPermissions: (permissions: Set<string>) => void
}

const initialState: ProjectContext = {
    selectedProject: null,
    setSelectedProject: () => null,
    selectedProjectPermissions: new Set<string>(),
    setSelectedProjectPermissions: () => null,
}

export const ProjectContext = createContext<ProjectContext>(initialState)