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
import { useProjects } from "@/hooks/projects/use-projects"
import { Trash2 } from "lucide-react"
import type { FC } from "react"
import { toast } from "sonner"
import type { Project } from "@/types/types"

interface IProps {
    project: Project
}

export const DeleteProjectModal: FC<IProps> = ({ project }) => {

    const { removeProject } = useProjects()

    const handleDelete = async () => {
        try {
            const projectId = project.id || ''
            removeProject.mutate({ id: projectId }, {
                onSuccess: () => {
                    toast.success("Project deleted successfully")
                },
                onError: () => {
                    toast.error("Error deleting project")
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
                <Button variant='ghost' size='sm' className="w-full justify-start">
                    <Trash2 className="text-red-600" />
                    <span className="text-red-600">Delete Project</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your project.
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