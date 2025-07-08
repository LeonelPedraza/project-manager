import { createContext } from "react";

interface GlobalState {
    leftSidebarOpen: boolean
    setLeftSideBarOpen: (open: boolean) => void
    rightSidebarOpen: boolean
    setRightSideBarOpen: (open: boolean) => void
}

const initialState: GlobalState = {
    leftSidebarOpen: true,
    setLeftSideBarOpen: () => null,
    rightSidebarOpen: false,
    setRightSideBarOpen: () => null,
}

export const GlobalStateContext = createContext<GlobalState>(initialState)

