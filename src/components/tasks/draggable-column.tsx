import type { TDraggableCard, TDraggableColumn } from "@/types/tasks.types"
import { Draggable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { ColumnDroppableArea } from "./column-droppable-area"
import { PencilIcon } from "lucide-react"

export const DraggableColumn = ({ column, cards, index }: { column: TDraggableColumn, cards: TDraggableCard[], index: number }) => {
    const { id, title } = column
    return (
        <Draggable draggableId={id} index={index} key={id}>
            {(dragProvided, snap) => (
                <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={clsx(
                        "w-80 shrink-0 h-min rounded px-2 bg-[hsl(var(--kanban-column))] border-[hsl(var(--kanban-border))] shadow-md",
                        snap.isDragging && "shadow-xl ring-2 ring-primary"
                    )}
                >
                    <h3
                        className="py-3 px-2 text-sm font-semibold "
                        {...dragProvided.dragHandleProps}
                    >
                        {title}
                    </h3>

                    {/* Droppable de cards */}
                    <ColumnDroppableArea column={column} cards={cards} />
                    <div className="flex gap-2 py-2">
                        <button className="btn btn-ghost flex items-center gap-2 py-2 hover:bg-muted w-full rounded cursor-pointer px-4">
                            <PencilIcon className="w-4 h-4" />
                            <span>Crea una tarjeta</span>
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    )
}