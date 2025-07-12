import type { FC } from "react"
import { useParams } from "react-router"
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
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

import type { Invitation } from "@/types/types"
import { useMembers } from "@/hooks/members/use-member"

interface IProps {
    invitation: Invitation | null
}

export const DeleteInvitationModal: FC<IProps> = ({ invitation }) => {

    const { projectId } = useParams()
    const { deleteInvitation } = useMembers(projectId)

    const handleDelete = async () => {
        if (!invitation) {
            toast.error("No invitation selected")
            return
        }
        try {
            deleteInvitation.mutate({ id: invitation.id })
            toast.success("Project deleted successfully")
        } catch (error) {
            console.error(error)
            toast.error("Error deleting project")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='ghost' size='sm' className="w-full justify-start hover:bg-red-500 hover:text-red-500">
                    <Trash2 className="text-red-500" />
                    <span className="text-red-500">Delete Invitation</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the invitation to <strong>"{invitation?.invited_email}"</strong>.
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