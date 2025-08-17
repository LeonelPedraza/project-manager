import type { TDraggableCard, TDraggableColumn } from "@/types/tasks.types"
import { Droppable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { DraggableCard } from "./draggable-card"

export const ColumnDroppableArea = ({ column, cards }: { column: TDraggableColumn, cards: TDraggableCard[] }) => {
    const { id } = column
    return (
        <Droppable droppableId={id} type="CARD">
            {(prov, cardSnap) => (
                <div
                    ref={prov.innerRef}
                    {...prov.droppableProps}
                    className={clsx(
                        "flex flex-col min-h-0.5 gap-2 rounded",
                        cardSnap.isDraggingOver && "bg-background/20"
                    )}
                >
                    {cards.map((card, i) => {
                        return (
                            <DraggableCard card={card} index={i} key={card.id} />
                        )
                    })}
                    {prov.placeholder /* IMPORTANTE para layout */}
                </div>
            )}
        </Droppable>
    )
}