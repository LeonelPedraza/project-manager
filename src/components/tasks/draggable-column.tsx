import type { TDraggableCard, TDraggableColumn } from "@/types/tasks.types"
import { Draggable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { ColumnDroppableArea } from "./column-droppable-area"
import React from "react"
import { NewCard } from "./tasks/new-card"

export const DraggableColumn = React.memo(function DraggableColumn({ column, cards, index }: { column: TDraggableColumn, cards: TDraggableCard[], index: number }) {
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
                    style={dragProvided.draggableProps.style}
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
                        <NewCard stageId={id} />
                    </div>
                </div>
            )}
        </Draggable>
    )
})