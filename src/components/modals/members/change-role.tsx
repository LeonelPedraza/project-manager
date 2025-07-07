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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRoles } from "@/hooks/roles/use-roles"
import { useMembers } from "@/hooks/members/use-member"
import { useParams } from "react-router"

interface IProps {
    memberId: string
    open: boolean
    onClose: () => void
}

export const ChangeRoleModal: FC<IProps> = ({ memberId, open, onClose }) => {

    const { projectId } = useParams()

    const { changeMemberRole } = useMembers(projectId)
    const { roles } = useRoles()

    const formSchema = z.object({
        role: z.string(),
    })

    const { control, reset, formState: { errors }, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            changeMemberRole.mutate({
                memberId,
                roleId: selectedRole.id
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
                        <DialogTitle>Change role</DialogTitle>
                        <DialogDescription>
                            Cambia el rol de un miembro del proyecto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
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
                            <Button variant="outline" disabled={changeMemberRole.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={changeMemberRole.isPending} className="">
                            {changeMemberRole.isPending ? 'Updating...' : 'Update'}  
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
