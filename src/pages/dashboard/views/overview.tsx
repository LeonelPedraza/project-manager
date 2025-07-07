import { useAppState } from "@/hooks/use-app-state"

export default function Project() {
    const { selectedProject } = useAppState()
    return (
        <div>
            {selectedProject?.project?.name}
        </div>
    )
}