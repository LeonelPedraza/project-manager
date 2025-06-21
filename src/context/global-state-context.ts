import { createContext } from "react";
import type { Project } from "@/types/types";


interface GlobalState {
    leftSidebarOpen: boolean
    setLeftSideBarOpen: (open: boolean) => void
    rightSidebarOpen: boolean
    setRightSideBarOpen: (open: boolean) => void
    selectedProject: Project | null
    setSelectedProject: (project: Project) => void
}

const initialState: GlobalState = {
    leftSidebarOpen: true,
    setLeftSideBarOpen: () => null,
    rightSidebarOpen: false,
    setRightSideBarOpen: () => null,
    selectedProject: null,
    setSelectedProject: () => null
}

export const GlobalStateContext = createContext<GlobalState>(initialState)

