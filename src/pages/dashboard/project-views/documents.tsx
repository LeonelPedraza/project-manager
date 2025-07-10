import { AddDocument } from "@/components/documents/add-document";
import { UploadDocument } from "@/components/documents/upload-document";
import { AddFolderModal } from "@/components/modals/documets.tsx/add-folder";
import { SearchInput } from "@/components/ui/search-input";
import { useFolder } from "@/hooks/documents/use-folder";
import { useParams } from "react-router";


export default function Documents() {

    const { projectId } = useParams()
    const { folders, isLoading } = useFolder(projectId ?? '')

    

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Documents</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-4 overflow-x-auto">
                <SearchInput
                    placeholder="Find a member..."
                    value={""}
                    onChange={() => { }}
                />
                <div className="flex gap-2">
                    <AddFolderModal />
                    <AddDocument />
                    <UploadDocument />
                </div>
            </div>
            <div>
                {
                    isLoading ? 'Loading...' : ''
                }
                {
                    JSON.stringify(folders)
                }
            </div>
        </div>
    )
}