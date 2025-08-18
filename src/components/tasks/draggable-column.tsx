import type { TDraggableCard, TDraggableColumn } from "@/types/tasks.types"
import { Draggable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { ColumnDroppableArea } from "./column-droppable-area"
import React from "react"
import { NewCard } from "./tasks/new-card"
import { RemoveStage } from "./stage/remove-stage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Ellipsis } from "lucide-react"

export const DraggableColumn = React.memo(function DraggableColumn({ column, cards, index }: { column: TDraggableColumn, cards: TDraggableCard[], index: number }) {
    const { id, title } = column
    return (
        <Draggable draggableId={id} index={index} key={id}>
            {(dragProvided, snap) => (
                <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={clsx(
                        "w-80 shrink-0 h-min rounded px-2 bg-[hsl(var(--kanban-column))] border-[hsl(var(--kanban-border))] shadow-md cursor-pointer",
                        snap.isDragging && "shadow-xl ring-2 ring-primary"
                    )}
                    style={dragProvided.draggableProps.style}
                >
                    <div className="flex justify-between items-center gap-2" {...dragProvided.dragHandleProps}>
                        <h3 className="py-3 px-2 text-sm font-semibold ">
                            {title}
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-0.5 rounded mr-2 cursor-pointer hover:bg-muted">
                                <Ellipsis className="w-5 h-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="start">
                                <DropdownMenuItem variant="destructive">
                                    <RemoveStage stageId={id} title={title} />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Droppable de cards */}
                    <ColumnDroppableArea column={column} cards={cards} />
                    <div className="py-2">
                        <NewCard stageId={id} />
                    </div>
                </div>
            )}
        </Draggable>
    )
})