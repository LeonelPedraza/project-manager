import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { FilePlus2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFolder } from "@/hooks/documents/use-folder";
import type { DriveItemType } from "@/lib/enums/drive-item-type";
interface IProps {
    open: boolean
    setOpen: (open: boolean) => void
    driveItemId: string
    itemType: DriveItemType
}

export const MoveDriveItemModal = ({open, setOpen, driveItemId, itemType}: IProps) => {

    const { projectId } = useParams()
    const { folders, moveDriveItem } = useFolder(projectId ?? '')

    const formSchema = z.object({
        parentFolderId: z.string(),
    })

    const { handleSubmit, formState: { errors }, control, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            parentFolderId: "",
        }
    });

    const sendData = handleSubmit(async (data) => {
        try {
            const reqBody = {
              driveItemId,
              itemType,
              projectId: projectId ?? "",
              parentFolderId: data.parentFolderId
            };
            moveDriveItem.mutate(reqBody, {
                onSuccess: () => {
                    toast.success("Item moved successfully")
                    reset()
                    setOpen(false)
                },
                onError: (error) => {
                    toast.error(error.message)
                }
            })
        } catch (error) {
            console.error(error)
            toast.error(`Error moving ${itemType}`)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FilePlus2 />
                    Add Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={sendData} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Move {itemType}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="parentFolderId">Parent Folder</Label>
                            <Controller
                                name="parentFolderId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="parentFolderId" className={errors.parentFolderId ? "border-red-500" : ""}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                folders?.map(({ drive_folder_id, name }) => (
                                                    <SelectItem value={drive_folder_id} key={drive_folder_id}>{name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.parentFolderId && <p className="text-red-500 text-sm">{errors.parentFolderId.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={moveDriveItem.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={moveDriveItem.isPending} className="">
                            {moveDriveItem.isPending ? 'Moving...' : 'Move'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}