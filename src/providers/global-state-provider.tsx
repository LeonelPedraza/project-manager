import { useState, type ReactNode } from "react"
import { GlobalStateContext } from "@/context/global-state-context"
import type { Project } from "@/types/types"

interface GlobalStateProvider {
    children: ReactNode
}

export const GlobalStateProvider = ({ children }: GlobalStateProvider) => {

    const [leftSidebarOpen, setLeftSideBarOpen] = useState<boolean>(true)
    const [rightSidebarOpen, setRightSideBarOpen] = useState<boolean>(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    const value = {
        leftSidebarOpen,
        setLeftSideBarOpen,
        rightSidebarOpen,
        setRightSideBarOpen,
        selectedProject,
        setSelectedProject
    }

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    )
}