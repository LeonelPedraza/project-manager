import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTasks } from "@/hooks/tasks/use-tasks"
import { PencilIcon } from "lucide-react"
import { useParams } from "react-router"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor"


export const NewCard = ({ stageId }: { stageId: string }) => {

    const { projectId } = useParams()
    const { stages, addCard } = useTasks({ projectId: projectId as string })
    const [showForm, setShowForm] = useState(false);

    const currentStage = stages?.find(stage => stage.id === stageId)

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
            //   HorizontalRule,
            //   TextAlign.configure({ types: ["heading", "paragraph"] }),
            //   TaskList,
            //   TaskItem.configure({ nested: true }),
            //   Highlight.configure({ multicolor: true }),
            //   Image,
            //   Typography,
            //   Superscript,
            //   Subscript,
            //   Selection
        ],
        content: '',
    })

    const formSchema = z.object({
        title: z.string().min(1).max(100),
        position: z.number(),
        stageId: z.string()
    })

    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            position: currentStage?.cards.length ?? 0,
            stageId: stageId
        },
        resolver: zodResolver(formSchema)
    })

    const onSubmit = handleSubmit((data) => {
        if (!currentStage) {
            return
        }
        addCard.mutate({
            cardData: {
                ...data,
                description: editor?.getJSON() ?? {},
            }
        }, {
            onSuccess: () => {
                setShowForm(false)
                reset()
                editor?.destroy()
                toast.success("Task added successfully")
            },
            onError: () => {
                toast.error("Error added task")
            }
        })
    })

    return (
        <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger type="button" className="w-full hover:bg-muted">
                <div className="flex justify-center items-center gap-2 py-2 w-full rounded cursor-pointer px-4">
                    <PencilIcon className="w-4 h-4" />
                    <span className="text-sm">Crea una tarjeta</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add task</DialogTitle>
                    <DialogDescription>
                        Add task to the project.
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
                    <div className="grid gap-3">
                        <Label htmlFor="email" className="flex items-center">
                            Content
                        </Label>
                        <SimpleEditor editor={editor} />
                    </div>
                    <DialogFooter className="mt-auto mb-0">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => reset()} disabled={addCard.isPending}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={addCard.isPending} className="">
                            {addCard.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}