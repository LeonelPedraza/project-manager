export type TDraggableCard = { id: string; title: string; position: number; listId: string }
export type TDraggableColumn = { id: string; title: string; position: number; cardIds: string[] }

export type BoardState = {
    columnOrder: string[]; // orden de columnas
    columns: Record<string, TDraggableColumn>;
    cards: Record<string, TDraggableCard>;
}