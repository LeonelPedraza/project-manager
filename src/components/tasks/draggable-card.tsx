import React from "react"
import type { TDraggableCard } from "@/types/tasks.types"
import { Draggable } from "@hello-pangea/dnd"
import clsx from "clsx"


export const DraggableCard = React.memo(function DraggableCard({ card, index }: { card: TDraggableCard, index: number }) {
    const { id, title } = card
    return (
        <Draggable draggableId={id} index={index}>
            {(p, s) => (
                <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    className={clsx(
                        "rounded p-3 text-sm shadow bg-[hsl(var(--kanban-card))] text-card-foreground leading-5 select-none",
                        s.isDragging && "ring-2 ring-ring ring-offset-2 ring-offset-background shadow-md"
                    )}
                    style={p.draggableProps.style}
                >
                    {title}
                </div>
            )}
        </Draggable>
    )
})