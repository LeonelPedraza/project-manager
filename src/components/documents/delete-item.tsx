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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

import type { DriveItemType } from "@/lib/enums/drive-item-type"
import { useFolder } from "@/hooks/documents/use-folder"

interface IProps {
    itemName: string
    driveItemId: string
    itemType: DriveItemType
    open: boolean
    setOpen: (open: boolean) => void
}

export const DeleteDriveItemModal: FC<IProps> = ({ itemName, driveItemId, itemType, open, setOpen }) => {
    console.log(itemName)
    const { projectId } = useParams();
    const { removeDriveItem } = useFolder(projectId ?? '');

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const data = {
                driveItemId,
                itemType
            }
            removeDriveItem.mutate(data, {
                onSuccess: () => {
                    toast.success("Item deleted successfully");
                    setOpen(false);
                },
                onError: () => {
                    toast.error("Error deleting project");
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("Error deleting project");
        }
    };

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item <strong>"{itemName}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeDriveItem.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={removeDriveItem.isPending}
            >
              { removeDriveItem.isPending ? 'Deleting...' : 'Delete' }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
};