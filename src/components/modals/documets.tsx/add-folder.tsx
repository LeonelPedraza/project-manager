import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useFolder } from "@/hooks/documents/use-folder";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { FolderPlus } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
// import { Controller } from "react-hook-form";

export const AddFolderModal = () => {

    const { projectId } = useParams()

    const { addFolder } = useFolder(projectId ?? '')

    const formSchema = z.object({
        folderName: z.string().min(3, { message: "Folder name is required" }),
        folderParentId: z.string().optional().nullable(),
        projectId: z.string()
    })

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            folderName: "",
            folderParentId: null,
            projectId: projectId
        }
    });

    const sendData = handleSubmit(async (data) => {
        try {
            const res = addFolder.mutate(data)
            console.log(res)
        } catch (error) {
            console.error(error)
            toast.error("Error creating folder")
        }
    })

    return (
        <Dialog>
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
                        {/* <div className="grid gap-3">
                    <Label htmlFor="role">Rol <span className="text-red-500">*</span></Label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                required
                            >
                                <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Selecciona el rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        roles.map(({ id, name }) => (
                                            <SelectItem value={name} key={id}>{name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div> */}
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