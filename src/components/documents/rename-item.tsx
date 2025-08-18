import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useFolder } from "@/hooks/documents/use-folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { DRIVE_ITEM_TYPE, type DriveItemType } from "@/lib/enums/drive-item-type";

interface IProps {
    currentName: string
    driveItemId: string
    itemType: DriveItemType
    open: boolean
    setOpen: (open: boolean) => void
}

export const RenameItemModal = ({ currentName, driveItemId, itemType, open, setOpen }: IProps) => {

    const { projectId } = useParams()
    const { renameDriveItem } = useFolder(projectId ?? '')

    const formSchema = z.object({
        newName: z.string().min(3, { message: "Folder name is required" }),
        driveItemId: z.string(),
        itemType: z.nativeEnum(DRIVE_ITEM_TYPE)
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newName: currentName,
            driveItemId,
            itemType
        }
    });

    const sendData = handleSubmit(async (data) => {
        try {            
            renameDriveItem.mutate(data, {
                onSuccess: () => {
                    toast.success("Item renamed successfully")
                    reset()
                    setOpen(false)
                },
                onError: () => {
                    toast.error('Error renaming item')
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error creating folder")
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={sendData} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Rename {itemType}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="folder-name" className="flex items-center">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="folder-name"
                                type="text"
                                className={errors.newName ? "border-red-500" : ""}
                                required
                                {...register('newName')}
                            />
                            {errors.newName && <p className="text-red-500 text-sm">{errors.newName.message}</p>}
                        </div>                        
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={renameDriveItem.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={renameDriveItem.isPending} className="">
                            {renameDriveItem.isPending ? 'Renaming...' : 'Rename'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}