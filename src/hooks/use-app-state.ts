import { GlobalStateContext } from "@/context/global-state-context"
import { useContext } from "react"


export const useAppState = () => {
    const context = useContext(GlobalStateContext)
    return context
}