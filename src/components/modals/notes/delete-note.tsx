import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"
import { useParams } from "react-router"
import { useNotes } from "@/hooks/notes/use-notes"

interface IProps {
    noteId: string
    noteTitle: string
}

export const DeleteNoteModal: FC<IProps> = ({ noteId, noteTitle }) => {

    const { projectId } = useParams()

    const { deleteNote } = useNotes(projectId ?? '')

    const handleDelete = async () => {
        try {
            deleteNote.mutate({ id: noteId }, {
                onSuccess: () => {
                    toast.success("Note deleted successfully")
                },
                onError: () => {
                    toast.error("Error deleting note")
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error deleting note")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='ghost' size='sm' className="group w-full justify-start hover:bg-red-500">
                    <Trash2 className="text-red-500 group-hover:text-white" />
                    <span className="text-red-500 group-hover:text-white">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <strong>"{noteTitle}"</strong> from the project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}