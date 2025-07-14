import { DocumentNode, FileTree } from "@/components/documents/file-tree";
// import { UploadDocument } from "@/components/documents/upload-document";
import { AddDocumentModal } from "@/components/modals/documets.tsx/add-document";
import { AddFolderModal } from "@/components/modals/documets.tsx/add-folder";
import { SearchInput } from "@/components/ui/search-input";
import { useDocuments } from "@/hooks/documents/use-documents";
import { useFolder } from "@/hooks/documents/use-folder";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { buildFolderTree, filterFolderTree } from "@/utils/build-tree";
import { useMemo, useState } from "react";
import { useParams } from "react-router";


export default function Documents() {
    const { projectId } = useParams()
    const { selectedProjectPermissions } = useSelectedProject()
    const { folders } = useFolder(projectId ?? '')
    const { documents } = useDocuments(projectId ?? '')
    const fullFolderTree = useMemo(() => buildFolderTree(folders ?? [], documents ?? []), [folders, documents])
    const [searchValue, setSearchValue] = useState("")

    const currentDisplayedTree = useMemo(() => {
        if (!searchValue) {
            return {
                treeNodes: fullFolderTree,
                rootDocuments: documents?.filter(doc => doc.parent_folder_id === null) ?? []
            }
        } else {
            const filteredTree = filterFolderTree(fullFolderTree, searchValue)
            const filteredDocuments = (documents ?? [])
                .filter(doc => doc.parent_folder_id === null)
                .filter(doc => doc.name.toLowerCase().includes(searchValue.toLowerCase()))
            return {
                treeNodes: filteredTree,
                rootDocuments: filteredDocuments
            }
        }
    }, [fullFolderTree, searchValue, documents])

    const handleSearch = (value: string) => {
        setSearchValue(value)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Documents</h1>
            </div>
            <div className="flex flex-col md:flex-row justify-between py-4 w-full gap-4">
                <SearchInput
                    placeholder="Find a file..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {
                    selectedProjectPermissions.has('documents:create') &&
                    <div className="flex gap-2 pb-2">
                        <AddFolderModal />
                        <AddDocumentModal />
                        {/* <UploadDocument /> */}
                    </div>
                }
            </div>
            <div>
                <FileTree folderTree={currentDisplayedTree.treeNodes} />
                {
                    currentDisplayedTree.rootDocuments.map(doc => (
                        <DocumentNode key={doc.id} document={doc} />
                    ))
                }
            </div>
        </div>
    )
}