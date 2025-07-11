import type { Document, Folder } from "@/types/types";

export function buildFolderTree(folders: Folder[], documents: Document[]) {
    const folderMap = new Map();

    // Agrupar carpetas por ID
    folders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [], documents: [] });
    });

    // Asociar carpetas hijas a sus padres
    folders.forEach(folder => {
        if (folder.parent_folder_id) {
            const parent = folderMap.get(folder.parent_folder_id);
            parent?.children.push(folderMap.get(folder.id));
        }
    });

    // Asociar documentos a sus carpetas
    documents.forEach(doc => {
        const folder = folderMap.get(doc.parent_folder_id);
        if (folder) {
            folder.documents.push(doc);
        }
    });

    // Filtrar carpetas raíz
    return folders.filter(f => !f.parent_folder_id).map(f => folderMap.get(f.id));
  }