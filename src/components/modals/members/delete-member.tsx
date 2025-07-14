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
import { useMembers } from "@/hooks/members/use-member"
import { useParams } from "react-router"

interface IProps {
    memberId: string
    memberName: string
}

export const DeleteMemberModal: FC<IProps> = ({ memberId, memberName }) => {

    const { projectId } = useParams()

    const { deleteMember } = useMembers(projectId)

    const handleDelete = async () => {
        try {
            deleteMember.mutate({ memberId }, {
                onSuccess: () => {
                    toast.success("Member deleted successfully")
                },
                onError: () => {
                    toast.error("Error deleting member")
                }
            })
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
                    <span className="text-red-500">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <strong>"{memberName}"</strong> from the project.
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