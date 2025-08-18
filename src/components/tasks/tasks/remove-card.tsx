import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTasks } from "@/hooks/tasks/use-tasks"
import type { TaskCard } from "@/types/tasks.types"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"


export const RemoveCard = ({ card }: { card: TaskCard }) => {
    const { projectId } = useParams()
    const [showModal, setShowModal] = useState(false)

    const { removeCard } = useTasks({ projectId: projectId as string })

    const handleDelete = () => {
        try {
            removeCard.mutate({
                cardId: card.id
            }, {
                onSuccess: () => {
                    setShowModal(false)
                    toast.success("Card deleted successfully")
                },
                onError: () => {
                    setShowModal(false)
                    toast.error("Error deleting card")
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
            <AlertDialogTrigger asChild>
                <Trash2 className="w-4 h-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        item <strong>"{card.title}"</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={removeCard.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={removeCard.isPending}
                    >
                        {removeCard.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}