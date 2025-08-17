import type { BoardState, TaskStage, TDraggableCard, TDraggableColumn } from "@/types/tasks.types"

/**
 * Convierte datos del servidor a BoardState
 * Implementa según tu estructura de datos
 */
export function convertToBoardState(taskStages: TaskStage[]): BoardState {
    const columns: Record<string, TDraggableColumn> = {}
    const columnOrder: string[] = []
    const boardCards: Record<string, TDraggableCard> = {}

    // Ordenar stages por posición
    const sortedStages = taskStages.sort((a, b) => a.position - b.position)

    // Procesar cada stage
    sortedStages.forEach(stage => {
        // Crear la columna
        columns[stage.id] = {
            id: stage.id,
            title: stage.title, // Usar 'name' en lugar de 'title' según tu estructura
            position: stage.position,
            cardIds: []
        }

        // Agregar al orden de columnas
        columnOrder.push(stage.id)

        // Procesar las cards de este stage
        if (stage.cards && stage.cards.length > 0) {
            // Ordenar cards por posición
            const sortedCards = stage.cards.sort((a, b) => a.position - b.position)

            sortedCards.forEach(card => {
                // Crear la card en el objeto de cards
                boardCards[card.id] = {
                    id: card.id,
                    title: card.title,
                    position: card.position,
                    stage_id: card.stage_id
                    // Agregar otras propiedades que tengas en TDraggableCard
                }

                // Agregar el ID de la card a la columna
                columns[stage.id].cardIds.push(card.id)
            })
        }
    })

    return {
        cards: boardCards,
        columns,
        columnOrder
    }
}