import { AddNoteModal } from "@/components/modals/notes/add-note";
import { SearchInput } from "@/components/ui/search-input";
import StickyNote from "@/components/ui/sticky-note";

export default function NotesView() {

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Notes</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-2">
                <SearchInput
                    placeholder="Find a member..."
                    value={""}
                    onChange={() => {}}
                />
                <AddNoteModal />
            </div>
            <div className="w-full flex flex-wrap gap-4">
                <StickyNote title="Note Title" className="bg-yellow-200 text-yellow-950"  content="This is a sticky note. It will stick to the top of the screen as you scroll down. It will stick to the top of the screen as you scroll down. It will stick to the top of the screen as you scroll down." />
                <StickyNote title="Note Title" className="bg-blue-200 text-blue-950" content="This is a sticky note." />
                <StickyNote title="Note Title" className="bg-green-200 text-green-950" content="This is a sticky note. It will stick" />
                <StickyNote title="Note Title" className="bg-pink-200 text-pink-950" content="This is a sticky" />
                <StickyNote title="Note Title" className="bg-orange-200 text-orange-950" content="note" />
                <StickyNote title="Note Title" className="bg-purple-200 text-purple-950" content="This is a sticky note. It will stick to the top of" />
            </div>
        </div>
    )
}