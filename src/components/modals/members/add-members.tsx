import type { FC } from "react"
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
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoles } from "@/hooks/projects/use-roles"
import { useAppState } from "@/hooks/use-app-state"
import { useMemberInvitations } from "@/hooks/projects/use-member-invitations"

interface IProps {
    open: boolean
    onClose: () => void
}

export const AddMemberModal: FC<IProps> = ({ open, onClose }) => {

    const { selectedProject } = useAppState()

    const { addMember } = useMemberInvitations(selectedProject?.project.id || '')
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
                project_id: selectedProject?.project.id || '',
                invited_email: data.email,
                role_id: selectedRole.id
            })
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
                        <DialogTitle>Add member</DialogTitle>
                        <DialogDescription>
                            Envía invitaciones por correo electrónico a nuevos miembros para unirse al proyecto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
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
                            <Label htmlFor="role">Rol <span className="text-red-500">*</span></Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({field}) => (
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
