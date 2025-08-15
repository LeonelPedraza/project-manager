import { useEditor } from "@tiptap/react"
import type { Note } from "@/types/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import StarterKit from "@tiptap/starter-kit"
import HorizontalRule from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import TextAlign from "@tiptap/extension-text-align"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { Highlight } from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import { Image } from "@tiptap/extension-image"
import { Selection } from "@tiptap/extensions"

interface IProps {
    note: Note
    open: boolean
    setOpen: (open: boolean) => void
}

export const DetailsNoteModal = ({note, open, setOpen}: IProps) => {
    
    const editor = useEditor({
        editable: false,
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
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
        content: note.content,
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-4xl h-5/6 overflow-y-auto py-4">
                <DialogHeader>
                    <DialogTitle>{note.title}</DialogTitle>
                    <DialogDescription>
                        {note.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                <SimpleEditor editor={editor} showToolbar={false} />

                </div>
            </DialogContent>
        </Dialog>
    )
}