import { FileTree } from "@/components/documents/file-tree";
import { UploadDocument } from "@/components/documents/upload-document";
import { AddDocumentModal } from "@/components/modals/documets.tsx/add-document";
import { AddFolderModal } from "@/components/modals/documets.tsx/add-folder";
import { SearchInput } from "@/components/ui/search-input";


export default function Documents() {    

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Documents</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-4">
                <SearchInput
                    placeholder="Find a file..."
                    value={""}
                    onChange={() => { }}
                />
                <div className="flex gap-2 pb-2">
                    <AddFolderModal />
                    <AddDocumentModal />
                    <UploadDocument />
                </div>
            </div>
            <div>
                <FileTree />
            </div>
        </div>
    )
}