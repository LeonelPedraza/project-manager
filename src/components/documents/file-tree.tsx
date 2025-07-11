import { useState } from "react";
import { Folder, FileText, FileSpreadsheet, FileVideo } from "lucide-react";
import type { Document } from "@/types/types";
import { useParams } from "react-router";
import { useFolder } from "@/hooks/documents/use-folder";
import { useDocuments } from "@/hooks/documents/use-documents";
import { buildFolderTree } from "@/utils/build-tree";

type FolderType = {
    id: string;
    name: string;
    children: FolderType[];
    documents: Document[];
};

const FILE_ICONS = {
    doc: FileText,
    sheet: FileSpreadsheet,
    ppt: FileVideo
}

export function FileTree() {
    const { projectId } = useParams()
    const { folders } = useFolder(projectId ?? '')
    const { documents } = useDocuments(projectId ?? '')
    const folderTree = buildFolderTree(folders ?? [], documents ?? [])
    return (
        <div>
            {folderTree.map(folder => (
                <FolderNode key={folder.id} folder={folder} />
            ))}
            {
                documents?.filter(doc => doc.parent_folder_id === null)?.map(doc => (
                    <DocumentNode key={doc.id} document={doc} />
                ))
            }
        </div>
    );
}

const DocumentNode = ({ document }: { document: Document }) => {
    const Icon = FILE_ICONS[document.file_type] ?? FileText;
    return (
        <a
            key={document.id}
            href={document.drive_file_url}
            target="_blank"
            className="flex items-center gap-2 p-2 rounded text-white/90 text-sm hover:text-foreground hover:bg-muted"
        >
            <Icon className="h-5 w-5" />
            {document.name}
        </a>

    )
}

function FolderNode({ folder }: { folder: FolderType }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        if (folder.documents.length > 0) {
            setOpen(!open)
        }
    }

    return (
        <div className="">
            <div
                className="flex items-center justify-between gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                onClick={handleOpen}
            >
                <div className="flex gap-2 items-center">
                    <Folder className="h-6 w-6" />
                    <span className="font-medium">{folder.name}</span>
                </div>
            </div>

            {open && (
                <div className="ml-6 py-1 space-y-1">
                    {folder.children.map(child => (
                        <FolderNode key={child.id} folder={child} />
                    ))}
                    {folder.documents.map(doc => (
                        <DocumentNode key={doc.id} document={doc} />
                    ))}
                </div>
            )}
        </div>
    );
}
