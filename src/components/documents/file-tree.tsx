import { useState } from "react";
import { Folder, FileText, FileSpreadsheet, FileVideo, EllipsisVertical, Pencil, Trash, Copy, FolderSymlink } from "lucide-react";
import type { Document } from "@/types/types";
import { useParams } from "react-router";
import { useDocuments } from "@/hooks/documents/use-documents";
import { type TreeNode } from "@/utils/build-tree";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DRIVE_ITEM_TYPE, type DriveItemType } from "@/lib/enums/drive-item-type";
import { RenameItemModal } from "./rename-item";
import { DeleteDriveItemModal } from "./delete-item";
import { toast } from "sonner";
import { MoveDriveItemModal } from "./move-item";
import { useSelectedProject } from "@/hooks/use-selected-project";

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

export function FileTree({ folderTree }: { folderTree: TreeNode[]}) {

  return (
    <div>
      {folderTree.map((folder) => (
        <FolderNode key={folder.id} folder={folder} />
      ))}
      
    </div>
  );
}

export const FolderNode = ({ folder }: { folder: FolderType }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        if (folder.documents.length > 0 || folder.children.length > 0) {
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

export const DocumentNode = ({ document }: { document: Document }) => {
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
            <Actions currentName={document.name} driveItemId={document.drive_file_id} itemType={DRIVE_ITEM_TYPE.FILE} folderParentId={document.parent_folder_id} mimeType={document.file_type} />
        </a>

    )
}

const Actions = ({ currentName, driveItemId, itemType, folderParentId, mimeType }: { currentName: string, driveItemId: string, itemType: DriveItemType, folderParentId?: string, mimeType?: string }) => {
    const { projectId } = useParams()
    const { selectedProjectPermissions } = useSelectedProject()
    const [renameItemModalOpen, setRenameItemModalOpen] = useState(false)
    const [moveItemModalOpen, setMoveItemModalOpen] = useState(false)
    const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
    const { copyDocument } = useDocuments(projectId ?? '')
    const copyDocumentHandler = () => {
        try {
            let pendingToastId: string | number | null = null
            const data = {
                fileId: driveItemId,
                fileName: currentName,
                mimeType: mimeType ?? '',
                parentFolderId: folderParentId,
                projectId: projectId ?? ''
            }
            pendingToastId = toast.loading("Copying file...")
            copyDocument.mutate(data, {
                onSuccess: () => {
                    toast.success("File copied successfully", { id: pendingToastId })
                    setRenameItemModalOpen(false)
                },
                onError: () => {
                    toast.error("Error copying file", { id: pendingToastId })
                    setRenameItemModalOpen(false)
                }
            })
        } catch (error) {
            console.error(error)
            toast.error("Error copying file")
        }        
    }
    
    if (!selectedProjectPermissions.has('documents:update')) {
        return null
    }
    return (
        <div className="flex gap-2 items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" disabled={copyDocument.isPending}>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem onClick={() => setRenameItemModalOpen(true)}>
                        <Pencil />
                        Rename
                    </DropdownMenuItem>
                    {
                        itemType === DRIVE_ITEM_TYPE.FILE &&
                        <DropdownMenuItem onClick={copyDocumentHandler}>
                            <Copy />
                            Create copy
                        </DropdownMenuItem>

                    }
                    <DropdownMenuItem onClick={() => setMoveItemModalOpen(true)}>
                        <FolderSymlink />
                        Move
                    </DropdownMenuItem>
                    {
                        selectedProjectPermissions.has('documents:delete') &&
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteItemModalOpen(true)}>
                                <Trash />
                                Delete
                            </DropdownMenuItem>
                        </>
                    }
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
            {
                moveItemModalOpen &&
                <MoveDriveItemModal 
                    open={moveItemModalOpen}
                    setOpen={setMoveItemModalOpen}
                    driveItemId={driveItemId}
                    itemType={itemType}
                />
            }
        </div>
    );
}
