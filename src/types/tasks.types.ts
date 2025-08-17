export type TDraggableCard = { id: string; title: string; position: number; stage_id: string }
export type TDraggableColumn = { id: string; title: string; position: number; cardIds: string[] }

export type BoardState = {
    columnOrder: string[]; // ids de stages ordenados
    columns: Record<string, TDraggableColumn>;
    cards: Record<string, TDraggableCard>;
}

export type TaskStage = {
    id: string;
    title: string;
    position: number;
    cards: TaskCard[];
}

export type TaskCard = {
    id: string;
    title: string;
    content: object | null;
    position: number;
    stage_id: string;
}