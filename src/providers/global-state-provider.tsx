import { useState, type ReactNode } from "react"
import { GlobalStateContext } from "@/context/global-state-context"

interface GlobalStateProvider {
    children: ReactNode
}

export const GlobalStateProvider = ({ children }: GlobalStateProvider) => {

    const [leftSidebarOpen, setLeftSideBarOpen] = useState<boolean>(true)
    const [rightSidebarOpen, setRightSideBarOpen] = useState<boolean>(false)

    const value = {
        leftSidebarOpen,
        setLeftSideBarOpen,
        rightSidebarOpen,
        setRightSideBarOpen,
    }

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    )
}