import { AddNoteModal } from "@/components/modals/notes/add-note";
import { SearchInput } from "@/components/ui/search-input";
import StickyNote from "@/components/ui/sticky-note";
import { useNotes } from "@/hooks/notes/use-notes";
import { useParams } from "react-router";

export default function NotesView() {
    const { projectId } = useParams()
    const { notes, isLoading } = useNotes(projectId ?? '')

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Notes</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-2">
                <SearchInput
                    placeholder="Find a note..."
                    value={""}
                    onChange={() => {}}
                />
                <AddNoteModal />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading && <span>Loading...</span>}
                {
                    notes?.map((note) => (
                        <StickyNote
                            key={note.id}
                            note={note}
                        />
                    ))
                }
            </div>
        </div>
    )
}