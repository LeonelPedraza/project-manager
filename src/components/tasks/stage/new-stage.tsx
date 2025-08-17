import { useState } from "react";
import { z } from 'zod'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTasks } from "@/hooks/tasks/use-tasks";
import { toast } from "sonner";


export const NewStage = ({ projectId }: { projectId?: string }) => {
    const { stages, addStage } = useTasks({ projectId: projectId as string })
    const [showForm, setShowForm] = useState(false);
    const currentPosition = stages?.length ?? 0

    const formSchema = z.object({
        title: z.string().min(1).max(50),
    })

    const { register, reset, formState: { errors }, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = handleSubmit(async (data) => {
        try {
            addStage.mutate({
                projectId: projectId as string,
                stageData: {
                    title: data.title,
                    position: currentPosition,
                }
            }, {
                onSuccess: () => {
                    toast.success("Stage added successfully")
                    setShowForm(false)
                    reset()
                },
                onError: () => {
                    toast.error("Error adding stage")
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error creating stage")
        }
    })

    return (
        <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
                <Button variant='ghost' className='w-80 flex justify-start py-6 px-12 gap-2 bg-[hsl(var(--kanban-column))] border-[hsl(var(--kanban-border))]'>
                    <Plus />
                    <span>Agregar otra lista</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto py-4">
                <DialogHeader>
                    <DialogTitle>Add stage</DialogTitle>
                    <DialogDescription>
                        Add stage to the project.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-3">
                        <Label htmlFor="title" className="flex items-center">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            type="title"
                            placeholder="Title"
                            className={errors.title ? "border-red-500" : ""}
                            required
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <DialogFooter className="mt-auto mb-0">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={addStage.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addStage.isPending} className="">
                            {addStage.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}