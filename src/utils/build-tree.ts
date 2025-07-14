import type { Document, Folder } from "@/types/types";

export interface TreeNode {
    id: string;
    name: string;
    parent_folder_id: string | null;
    drive_folder_id: string;
    children: TreeNode[]; // Subcarpetas
    documents: Document[]; // Documentos dentro de esta carpeta
}

export function buildFolderTree(folders: Folder[], documents: Document[]): TreeNode[] {
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


export function filterFolderTree(tree: TreeNode[], searchTerm: string): TreeNode[] {
    if (!searchTerm) {
        // Si no hay término de búsqueda, devuelve el árbol completo
        return tree;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Función recursiva para filtrar nodos
    const filterNode = (node: TreeNode): TreeNode | null => {
        let hasMatchInDocuments = false;
        const filteredDocuments = node.documents.filter(doc => {
            const matches = doc.name.toLowerCase().includes(lowerCaseSearchTerm);
            if (matches) {
                hasMatchInDocuments = true;
            }
            return matches;
        });

        // Filtrar recursivamente las carpetas hijas
        let hasMatchInChildren = false;
        const filteredChildren = node.children
            .map(child => {
                const result = filterNode(child);
                if (result) {
                    hasMatchInChildren = true;
                }
                return result;
            })
            .filter(Boolean) as TreeNode[]; // Eliminar los nulos

        // Una carpeta se incluye si:
        // 1. Su propio nombre coincide con el término de búsqueda.
        // 2. O tiene documentos que coinciden.
        // 3. O tiene subcarpetas que, a su vez, contienen coincidencias.
        const nodeNameMatches = node.name.toLowerCase().includes(lowerCaseSearchTerm);

        if (nodeNameMatches || hasMatchInDocuments || hasMatchInChildren) {
            // Si la carpeta o sus descendientes tienen una coincidencia,
            // crea una nueva carpeta para el árbol filtrado.
            // Los documentos y hijos de esta carpeta se toman de los que ya fueron filtrados.
            return {
                ...node, // Mantiene todas las propiedades de la carpeta original
                children: filteredChildren,
                documents: filteredDocuments, // Solo los documentos que coinciden
            };
        }

        // Si la carpeta y sus descendientes no tienen coincidencias, se omite.
        return null;
    };

    // Aplica la función de filtro a las carpetas raíz del árbol
    const filteredTree = tree
        .map(rootNode => filterNode(rootNode))
        .filter(Boolean) as TreeNode[]; // Elimina cualquier raíz que no tenga coincidencias

    return filteredTree;
}