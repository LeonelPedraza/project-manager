import React from "react"
import type { TDraggableCard } from "@/types/tasks.types"
import { Draggable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { Button } from "../ui/button"
import { SquarePen } from "lucide-react"
import { RemoveCard } from "./tasks/remove-card"


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
                        "group flex items-center justify-between rounded p-3 text-sm shadow bg-[hsl(var(--kanban-card))] text-card-foreground leading-5 select-none min-h-12",
                        s.isDragging && "ring-2 ring-ring ring-offset-2 ring-offset-background shadow-md"
                    )}
                    style={p.draggableProps.style}
                >
                    <div>
                        {title}
                    </div>
                    <div className="hidden group-hover:flex items-center">
                        <Button size="sm" variant="ghost" className="w-6 h-6">
                            <SquarePen className="w-4 h-4" />
                        </Button>
                        <RemoveCard card={card} />
                    </div>
                </div>
            )}
        </Draggable>
    )
})