import { useState } from "react";
import { Folder, FileText, FileSpreadsheet, FileVideo, EllipsisVertical, Download, Pencil, Trash } from "lucide-react";
import type { Document } from "@/types/types";
import { useParams } from "react-router";
import { useFolder } from "@/hooks/documents/use-folder";
import { useDocuments } from "@/hooks/documents/use-documents";
import { buildFolderTree } from "@/utils/build-tree";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import { DRIVE_ITEM_TYPE, type DriveItemType } from "@/lib/enums/drive-item-type";
import { RenameItemModal } from "../modals/documets.tsx/rename-item";
import { DeleteDriveItemModal } from "../modals/documets.tsx/delete-item";

type FolderType = {
    id: string;
    name: string;
    drive_folder_id: string,
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
                className="group flex items-center justify-between gap-2 hover:bg-muted p-2 rounded"
                onClick={handleOpen}
            >
                <div className="flex gap-2 items-center">
                    <Folder className="h-6 w-6" />
                    <span className="font-medium">{folder.name}</span>
                </div>
                <Actions currentName={folder.name} driveItemId={folder.drive_folder_id} itemType={DRIVE_ITEM_TYPE.FOLDER} />
            </div>

            {open && (
                <div className="ml-6 py-1 space-y-1">
                    {folder.children.map((child) => (
                        <FolderNode key={child.id} folder={child} />
                    ))}
                    {folder.documents.map((doc) => (
                        <DocumentNode key={doc.id} document={doc} />
                    ))}
                </div>
            )}
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
            className="group flex items-center justify-between gap-2 p-2 rounded text-sm hover:bg-muted"
        >
            <div className="flex gap-2 items-center">
                <Icon className="h-5 w-5" />
                {document.name}
            </div>
            <Actions currentName={document.name} driveItemId={document.drive_file_id} itemType={DRIVE_ITEM_TYPE.FILE} />
        </a>

    )
}

const Actions = ({ currentName, driveItemId, itemType }: { currentName: string, driveItemId: string, itemType: DriveItemType }) => {
    const [renameItemModalOpen, setRenameItemModalOpen] = useState(false)
    const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
    return (
        <div className="flex gap-2 items-center">
            <Button variant="ghost" className="h-6 w-6 hidden group-hover:flex">
                <Download />
            </Button>
            <Button variant="ghost" className="h-6 w-6 hidden group-hover:flex" onClick={() => setRenameItemModalOpen(true)}>
                <Pencil />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem>
                        <Download />
                        Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRenameItemModalOpen(true)}>
                        <Pencil />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteItemModalOpen(true)}>
                        <Trash />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {
                renameItemModalOpen &&
                <RenameItemModal
                    currentName={currentName}
                    driveItemId={driveItemId}
                    itemType={itemType}
                    open={renameItemModalOpen}
                    setOpen={setRenameItemModalOpen}
                />
            }
            {
                deleteItemModalOpen &&
                <DeleteDriveItemModal
                    itemName={currentName}
                    driveItemId={driveItemId}
                    itemType={itemType}
                    open={deleteItemModalOpen}
                    setOpen={setDeleteItemModalOpen}
                />
            }
        </div>
    );
}
