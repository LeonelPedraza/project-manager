import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useFolder } from "@/hooks/documents/use-folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { FolderPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const AddFolderModal = () => {

    const { projectId } = useParams()
    const { folders, addFolder } = useFolder(projectId ?? '')

    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        folderName: z.string().min(3, { message: "Folder name is required" }),
        parentFolderId: z.string().optional().nullable(),
        projectId: z.string()
    })

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            folderName: "",
            parentFolderId: null,
            projectId: projectId
        }
    });

    const sendData = handleSubmit(async (data) => {
        try {            
            addFolder.mutate(data, {
                onSuccess: () => {
                    toast.success("Folder created successfully")
                    reset()
                    setOpen(false)
                },
                onError: () => {
                    toast.error('Error creating folder')
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error creating folder")
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FolderPlus />
                    Add Folder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={sendData} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Create Folder</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="folder-name" className="flex items-center">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="folder-name"
                                type="text"
                                className={errors.folderName ? "border-red-500" : ""}
                                required
                                {...register('folderName')}
                            />
                            {errors.folderName && <p className="text-red-500 text-sm">{errors.folderName.message}</p>}
                        </div>
                        {
                            folders && folders?.length > 0 &&
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
                        }
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={addFolder.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addFolder.isPending} className="">
                            {addFolder.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}