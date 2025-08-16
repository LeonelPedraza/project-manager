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
import { useParams } from "react-router"
import { StickyNote } from "lucide-react"
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { HorizontalRule } from "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { useEditor } from "@tiptap/react"
import { useNotes } from "@/hooks/notes/use-notes"
import { useUser } from "@/hooks/use-user"
import { colors } from "@/lib/constants/colors"
import { useState } from "react"

export const AddNoteModal = () => {
    const { projectId } = useParams()
    const { addNote } = useNotes(projectId ?? '')
    const { profile } = useUser()
    const [open, setOpen] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
          attributes: {
            autocomplete: "off",
            autocorrect: "off",
            autocapitalize: "off",
            "aria-label": "Main content area, start typing to enter text.",
            class: "simple-editor",
          },
        },
        extensions: [
          StarterKit.configure({
            horizontalRule: false,
            link: {
              openOnClick: false,
              enableClickSelection: true,
            },
          }),
          HorizontalRule,
          TextAlign.configure({ types: ["heading", "paragraph"] }),
          TaskList,
          TaskItem.configure({ nested: true }),
          Highlight.configure({ multicolor: true }),
          Image,
          Typography,
          Superscript,
          Subscript,
          Selection
        ],
        content: '',
      })

    const formSchema = z.object({
        title: z.string().min(1).max(50),
        color: z.string(),
        description: z.string().min(1).max(200),
    })

    const { control, register, reset, formState: { errors }, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            addNote.mutate({
                project_id: projectId ?? '',
                profile_id: profile?.id ?? '',
                title: data.title,
                color: data.color,
                description: data.description,
                content: editor?.getJSON() ?? {},
            }, {
                onSuccess: () => {
                    toast.success("Note added successfully")
                    setOpen(false)
                    reset()
                },
                onError: () => {
                    toast.error("Error adding note")
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error creating project")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <StickyNote />
                    Add note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl h-5/6 overflow-y-auto py-4">
                <DialogHeader>
                    <DialogTitle>Add note</DialogTitle>
                    <DialogDescription>
                        Envía invitaciones por correo electrónico a nuevos miembros para unirse al proyecto.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
                    <div className="grid gap-x-4 gap-y-6">
                        <div className="grid grid-cos-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="title" className="flex items-center">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="title"
                                    placeholder="Note title"
                                    className={errors.title ? "border-red-500" : ""}
                                    required
                                    {...register('title')}
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="color">Color</Label>
                                <Controller
                                    name="color"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger id="color" className={errors.color ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Selecciona el rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    colors.map((color) => (
                                                        <SelectItem value={color} key={color}>
                                                            <div className="flex flex-row gap-2 items-start">
                                                                <div className={`w-5 h-5 rounded-full bg-${color}-200`}></div>
                                                                <span>{color}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description" className="flex items-center">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="description"
                                type="description"
                                placeholder="Note description"
                                className={errors.description ? "border-red-500" : ""}
                                required
                                {...register('description')}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email" className="flex items-center">
                                Content
                            </Label>
                            <SimpleEditor editor={editor}/>
                        </div>
                    </div>
                    <DialogFooter className="mt-auto mb-0">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={addNote.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addNote.isPending} className="">
                            {addNote.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
