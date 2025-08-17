import { Button } from "@/components/ui/button"
import { useTasks } from "@/hooks/tasks/use-tasks"
import { PencilIcon } from "lucide-react"
import { useParams } from "react-router"


export const NewCard = ({ stageId }: { stageId: string }) => {

    const { projectId } = useParams()
    const { stages, addCard } = useTasks({ projectId: projectId as string })
    const currentStage = stages?.find(stage => stage.id === stageId)

    const handleClick = () => {
        if (!currentStage) {
            return
        }
        const newPosition = currentStage.cards.length
        addCard.mutate({
            cardData: {
                title: 'New task',
                position: newPosition,
                stageId: stageId
            }
        }, {
            onSuccess: () => {
                console.log('Task added successfully')
            },
            onError: () => {
                console.log('Error adding task')
            }
        })
    }
    
    return (
        <Button onClick={handleClick} variant="ghost" className="btn btn-ghost flex items-center gap-2 py-2 hover:bg-muted w-full rounded cursor-pointer px-4">
            <PencilIcon className="w-4 h-4" />
            <span>Crea una tarjeta</span>
        </Button>
    )
}