import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoles } from "@/hooks/roles/use-roles"
import { useMembers } from "@/hooks/members/use-member"
import { useParams } from "react-router"
import { StickyNote } from "lucide-react"

export const AddNoteModal = () => {
    const { projectId } = useParams()

    const { addMember } = useMembers(projectId)
    const { roles } = useRoles()

    const formSchema = z.object({
        email: z.string().email(),
        role: z.string(),
    })

    const { control, register, reset, formState: { errors }, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            const selectedRole = roles.find(item => item.name === data.role)
            if (!selectedRole) {
                toast.error("Error adding member")
                return
            }
            addMember.mutate({
                project_id: projectId ?? '',
                invited_email: data.email,
                role_id: selectedRole.id
            }, {
                onSuccess: () => {
                    toast.success("Member added successfully")
                    reset()
                },
                onError: () => {
                    toast.error("Error adding member")
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error creating project")
        }

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <StickyNote />
                    Add note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl h-5/6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Add note</DialogTitle>
                        <DialogDescription>
                            Envía invitaciones por correo electrónico a nuevos miembros para unirse al proyecto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid grid-cos-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="flex items-center">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="member@gmail.com"
                                    className={errors.email ? "border-red-500" : ""}
                                    required
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="role">Color</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
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
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email" className="flex items-center">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="member@gmail.com"
                                className={errors.email ? "border-red-500" : ""}
                                required
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={addMember.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addMember.isPending} className="">
                            {addMember.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
