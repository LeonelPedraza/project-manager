// hooks/use-board-dnd-with-persistence.ts
import { useState, useCallback } from "react"
import type { DropResult } from "@hello-pangea/dnd"
import type { BoardState} from "@/types/tasks.types"
import { toast } from "sonner"
import { getTasks, moveCard, moveColumn, type MoveCardData, type MoveColumnData } from "@/services/tasks"
import { convertToBoardState } from "@/utils/normalize-tasks-board-data"

interface UseBoardDndWithPersistenceProps {
    initialBoard: BoardState
    projectId: string
    onError?: (error: string) => void
}

export function useBoardDndWithPersistence({
    initialBoard,
    projectId,
    onError
}: UseBoardDndWithPersistenceProps) {
    // Estados
    const [board, setBoard] = useState<BoardState>(initialBoard)
    const [isUpdating, setIsUpdating] = useState(false)

    /**
     * Revierte el estado del tablero en caso de error
     */
    const revertBoard = useCallback((previousBoard: BoardState) => {
        setBoard(previousBoard)
        toast.error("No se pudo actualizar el tablero. Se ha revertido el cambio.")
    }, [])

    /**
     * Maneja el final del drag and drop con persistencia optimista
     */
    const onDragEnd = useCallback(async (result: DropResult) => {
        const { destination, source, draggableId, type } = result

        // Validaciones básicas
        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return
        }

        // Guardar estado previo para rollback
        const previousBoard = structuredClone(board)

        setIsUpdating(true)

        try {
            if (type === "COLUMN") {
                // === MOVER COLUMNA ===
                const newColumnOrder = Array.from(board.columnOrder)
                newColumnOrder.splice(source.index, 1)
                newColumnOrder.splice(destination.index, 0, draggableId)

                // Actualización optimista
                const newBoard = {
                    ...board,
                    columnOrder: newColumnOrder,
                }
                setBoard(newBoard)

                // Persistir en servidor
                const moveData: MoveColumnData = {
                    columnId: draggableId,
                    sourcePosition: source.index,
                    targetPosition: destination.index,
                    projectId
                }

                const result = await moveColumn(moveData)

                if (!result.success) {
                    throw new Error(result.error || 'Error moviendo columna')
                }

            } else {
                // === MOVER TARJETA ===
                const startColumn = board.columns[source.droppableId]
                const finishColumn = board.columns[destination.droppableId]

                if (!startColumn || !finishColumn) {
                    throw new Error('Columna no encontrada')
                }

                let newBoard: BoardState

                if (startColumn.id === finishColumn.id) {
                    // Misma columna
                    const newCardIds = Array.from(startColumn.cardIds)
                    newCardIds.splice(source.index, 1)
                    newCardIds.splice(destination.index, 0, draggableId)

                    newBoard = {
                        ...board,
                        columns: {
                            ...board.columns,
                            [startColumn.id]: {
                                ...startColumn,
                                cardIds: newCardIds,
                            },
                        },
                    }
                } else {
                    // Diferentes columnas
                    const startCardIds = Array.from(startColumn.cardIds)
                    const finishCardIds = Array.from(finishColumn.cardIds)

                    startCardIds.splice(source.index, 1)
                    finishCardIds.splice(destination.index, 0, draggableId)

                    newBoard = {
                        ...board,
                        columns: {
                            ...board.columns,
                            [startColumn.id]: {
                                ...startColumn,
                                cardIds: startCardIds,
                            },
                            [finishColumn.id]: {
                                ...finishColumn,
                                cardIds: finishCardIds,
                            },
                        },
                    }
                }

                // Actualización optimista
                setBoard(newBoard)

                // Persistir en servidor
                const moveData: MoveCardData = {
                    cardId: draggableId,
                    sourceStageId: source.droppableId,
                    targetStageId: destination.droppableId,
                    sourcePosition: source.index,
                    targetPosition: destination.index,
                    projectId
                }

                const result = await moveCard(moveData)

                if (!result.success) {
                    throw new Error(result.error || 'Error moviendo tarjeta')
                }
            }

        } catch (error) {
            console.error('❌ Error en onDragEnd:', error)

            // Rollback del estado
            revertBoard(previousBoard)

            // Notificar error
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            onError?.(errorMessage)

        } finally {
            setIsUpdating(false)
        }
    }, [board, projectId, revertBoard, onError])

    /**
     * Actualiza el tablero desde el servidor (para sync manual)
     */
    const syncBoard = useCallback(async () => {
        try {
            setIsUpdating(true)
            const taskStages = await getTasks({projectId})
            console.log(taskStages)
            if (!taskStages) {
                throw new Error('No se pudieron obtener los datos del proyecto')
            }
            // Convertir a BoardState (necesitarás implementar esta función)
            const newBoard = convertToBoardState(taskStages)
            setBoard(newBoard)
        } catch (error) {
            console.error('❌ Error sincronizando tablero:', error)
            toast.error("No se pudo sincronizar el tablero")
        } finally {
            setIsUpdating(false)
        }
    }, [projectId])

    return {
        board,
        setBoard,
        onDragEnd,
        isUpdating,
        syncBoard
    }
}


