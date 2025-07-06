import type { FC } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { ProjectType } from "@/lib/enums/project-type"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useProjects } from "@/hooks/projects/use-projects"

interface IProps {
    open: boolean
    onClose: () => void
}

export const NewProjectModal: FC<IProps> = ({ open, onClose }) => {

    const { addProject } = useProjects()

    const formSchema = z.object({
        name: z.string().min(4).max(50),
        description: z.string().min(4).max(200),
        project_type: z.nativeEnum(ProjectType),
    })

    const { control, register, reset, formState: { errors }, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            project_type: ProjectType.GENERIC,
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            addProject.mutate({...data})
            onClose()
            reset()
            toast.success("Project created successfully")
        } catch (error) {
            console.error(error)
            toast.error("Error creating project")
        }
        
    }

    const closeModal = () => {
        onClose()
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Crear nuevo proyecto</DialogTitle>
                        <DialogDescription>
                            Completa la información para crear un nuevo proyecto. Los campos marcados con * son obligatorios.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="project-name" className="flex items-center">
                                Nombre del proyecto <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="project-name"
                                placeholder="Ingresa el nombre del proyecto"
                                className={errors.name ? "border-red-500" : ""}
                                required
                                {...register('name')}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="project-description">Descripción <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="project-description"
                                placeholder="Describe brevemente el propósito del proyecto"
                                rows={3}
                                className={errors.description ? "border-red-500" : ""}
                                required
                                {...register('description')}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="project-type">Tipo de proyecto <span className="text-red-500">*</span></Label>
                            <Controller
                                name="project_type"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        required
                                    >
                                        <SelectTrigger id="project-type" className={errors.project_type ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                Object.values(ProjectType).map((type) => (
                                                    <SelectItem value={type} key={type}>{type}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.project_type && <p className="text-red-500 text-sm">{errors.project_type.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={addProject.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addProject.isPending} className="">
                            {addProject.isPending ? 'Creating...' : 'Create'} 
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
