import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { FilePlus2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/hooks/documents/use-documents";
import { useFolder } from "@/hooks/documents/use-folder";
import { useState } from "react";

const DOCUMENT_TYPES = [
    { value: 'doc', label: 'Word' },
    { value: 'ppt', label: 'PowerPoint' },
    { value: 'sheet', label: 'Excel' },
]

export const AddDocumentModal = () => {

    const { projectId } = useParams()
    const { folders } = useFolder(projectId ?? '')
    const { addDocument } = useDocuments(projectId ?? '')

    const [open, setOpen] = useState(false);

    const formSchema = z.object({
        documentName: z.string().min(3, { message: "Folder name is required" }),
        fileType: z.string(),
        parentFolderId: z.string().optional().nullable(),
        projectId: z.string()
    })

    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            documentName: "",
            fileType: "",
            parentFolderId: null,
            projectId: projectId
        }
    });

    const sendData = handleSubmit(async (data) => {
        try {
            addDocument.mutate(data, {
                onSuccess: () => {
                    toast.success("Document created successfully")
                    reset()
                    setOpen(false)
                },
                onError: () => {
                    toast.error('Error creating document')
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
                    <FilePlus2 />
                    Add Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={sendData} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Add Document</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="folder-name" className="flex items-center">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="folder-name"
                                type="text"
                                className={errors.documentName ? "border-red-500" : ""}
                                required
                                {...register('documentName')}
                            />
                            {errors.documentName && <p className="text-red-500 text-sm">{errors.documentName.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="fileType">Document Type</Label>
                            <Controller
                                name="fileType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="fileType" className={errors.fileType ? "border-red-500" : ""}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                DOCUMENT_TYPES?.map(({ value, label }) => (
                                                    <SelectItem value={value} key={value}>{label}</SelectItem> 
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fileType && <p className="text-red-500 text-sm">{errors.fileType.message}</p>}
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
                            <Button variant="outline" disabled={addDocument.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addDocument.isPending} className="">
                            {addDocument.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}