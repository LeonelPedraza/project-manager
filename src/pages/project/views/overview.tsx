import { useSelectedProject } from "@/hooks/use-selected-project"

export default function Overview() {

    const { selectedProject } = useSelectedProject()

    return (
        <div>
            {selectedProject?.name}
        </div>
    )
}