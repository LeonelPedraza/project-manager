import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTasks } from "@/hooks/tasks/use-tasks"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"


export const RemoveStage = ({ stageId, title }: { stageId: string, title: string }) => {
    const { projectId } = useParams()
    const [showModal, setShowModal] = useState(false)

    const { removeStage } = useTasks({ projectId: projectId as string })

    const handleDelete = () => {
        try {
            removeStage.mutate({stageId}, {
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
                <div className="flex gap-2 items-center">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    Remove stage
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        item <strong>"{title}"</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={removeStage.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={removeStage.isPending}
                    >
                        {removeStage.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}