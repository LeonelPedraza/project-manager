import { DraggableColumn } from '@/components/tasks/draggable-column';
import { Button } from '@/components/ui/button';
import type { BoardState } from '@/types/tasks.types';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react';
import { useState } from 'react';

const initial = {
    columnOrder: ['todo', 'doing', 'done'],
    columns: {
        todo: { id: 'todo', title: 'To Do', position: 1, cardIds: ['c1', 'c2'] },
        doing: { id: 'doing', title: 'Doing', position: 2, cardIds: ['c3'] },
        done: { id: 'done', title: 'Done', position: 3, cardIds: [] },
    },
    cards: {
        c1: { id: 'c1', title: 'Configurar Supabase', position: 1, listId: 'todo' },
        c2: { id: 'c2', title: 'UI con shadcn', position: 2, listId: 'todo' },
        c3: { id: 'c3', title: 'Drag & Drop base', position: 1, listId: 'doing' },
    }
}

/** Indexación fraccional (evita renumerar toda la lista) */
function computeBetween(prev: number | null, next: number | null): number {
    if (prev == null && next == null) return 1000 // primera card en lista vacía
    if (prev == null) return next! - 1            // insertar al inicio
    if (next == null) return prev + 1             // insertar al final
    return prev + (next - prev) / 2               // entre dos posiciones
}

const updateCardPosition = ({ id, listId, position }: { id: string, listId: string, position: number }) => {
    console.log(id, listId, position)
}

/** Stub de persistencia; ver sección 4 para Supabase real */
async function persistCard(id: string, data: { listId: string; position: number }) {

    requestAnimationFrame(() => {
        setTimeout(() => updateCardPosition({ id, listId: data.listId, position: data.position }), 1000)
    })
}


export default function TasksView() {
    const [board, setBoard] = useState<BoardState>(initial)

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result
        if (!destination) return

        // 1) Mover columnas
        if (type === 'COLUMN') {
            if (destination.index === source.index) return
            const newOrder = Array.from(board.columnOrder)
            const [moved] = newOrder.splice(source.index, 1)
            newOrder.splice(destination.index, 0, moved)
            setBoard({ ...board, columnOrder: newOrder })
            return
        }

        // 2) Mover cards
        const startCol = board.columns[source.droppableId]
        const endCol = board.columns[destination.droppableId]

        if (startCol === endCol) {
            // Reordenamiento en la MISMA columna
            const newCardIds = Array.from(startCol.cardIds)
            newCardIds.splice(source.index, 1)
            newCardIds.splice(destination.index, 0, draggableId)

            const newCol = { ...startCol, cardIds: newCardIds }
            setBoard({ ...board, columns: { ...board.columns, [newCol.id]: newCol } })

            // calcular position fraccional y persistir
            const prev = newCardIds[destination.index - 1]
            const next = newCardIds[destination.index + 1]
            const newPos = computeBetween(
                prev ? board.cards[prev].position : null,
                next ? board.cards[next].position : null
            )
            // persistir
            void persistCard(draggableId, { listId: startCol.id, position: newPos })
            return
        }

        // Movimiento ENTRE columnas
        const startIds = Array.from(startCol.cardIds)
        startIds.splice(source.index, 1)

        const endIds = Array.from(endCol.cardIds)
        endIds.splice(destination.index, 0, draggableId)

        const newStart = { ...startCol, cardIds: startIds }
        const newEnd = { ...endCol, cardIds: endIds }

        setBoard({
            ...board,
            columns: { ...board.columns, [newStart.id]: newStart, [newEnd.id]: newEnd },
            cards: { ...board.cards, [draggableId]: { ...board.cards[draggableId], listId: newEnd.id } }
        })

        const prev = endIds[destination.index - 1]
        const next = endIds[destination.index + 1]
        const newPos = computeBetween(
            prev ? board.cards[prev].position : null,
            next ? board.cards[next].position : null
        )
        void persistCard(draggableId, { listId: newEnd.id, position: newPos })
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Tasks</h1>
            </div>
            <div className='flex-1'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction='horizontal' type='COLUMN'>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-4 overflow-x-auto h-full p-4"
                            >
                                {board.columnOrder.map((colId, index) => {
                                    const col = board.columns[colId]
                                    return (
                                        <DraggableColumn column={col} cards={col.cardIds.map(id => board.cards[id])} index={index} />
                                    )
                                })}
                                {provided.placeholder}
                                <Button variant='ghost' className='w-80 flex justify-start py-6 px-12 gap-2 bg-[hsl(var(--kanban-column))] border-[hsl(var(--kanban-border))]'>
                                    <Plus/>
                                    <span>Agregar otra lista</span>
                                </Button>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}