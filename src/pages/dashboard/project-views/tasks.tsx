import { DraggableColumn } from '@/components/tasks/draggable-column';
import { NewStage } from '@/components/tasks/stage/new-stage';
import { Button } from '@/components/ui/button';
import { useBoardDndWithPersistence } from '@/hooks/tasks/use-board-dnd';
import { useTasks } from '@/hooks/tasks/use-tasks';
import { convertToBoardState } from '@/utils/normalize-tasks-board-data';
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function TasksView() {
    const { projectId } = useParams()
    const { stages, loading, error, refetch } = useTasks({ projectId: projectId as string })
    const initial = convertToBoardState(stages)

    const { board, onDragEnd, setBoard } = useBoardDndWithPersistence({
        initialBoard: initial,
        projectId: projectId!,
        onError: useCallback((error: string) => {
            toast.error(error);
        }, [])
    })

    // Sincronizar el board cuando cambien los stages del servidor
    useEffect(() => {
        if (stages && stages.length > 0) {
            const newBoard = convertToBoardState(stages)
            setBoard(newBoard)
        }
    }, [stages, setBoard])

    // Handlers
    const handleRefresh = useCallback(async () => {
        try {
            await refetch(); // Recargar desde el hook useTasks
            toast.success("Datos recargados desde el servidor");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error desconocido');
        }
    }, [refetch]);

    // const handleAddColumn = useCallback(() => {
    //     // TODO: Implementar creación de columna
    //     console.log('Agregar nueva columna');
    // }, []);

    // Estados de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando tablero...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-destructive mb-4">Error cargando el tablero</p>
                    <Button onClick={handleRefresh} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full w-full">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl">Tasks</h1>
            </div>
            <div className='flex-1 overflow-hidden w-11/12'>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" direction='horizontal' type='COLUMN'>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-4 p-2 h-full overflow-x-auto"
                            >
                                {board.columnOrder.map((colId, index) => {
                                    const col = board.columns[colId]
                                    const cards = col.cardIds.map(id => board.cards[id])
                                    return (
                                        <DraggableColumn key={colId} column={col} cards={cards} index={index} />
                                    )
                                })}
                                {provided.placeholder}
                                <div className='shrink-0'>
                                    <NewStage projectId={projectId} />
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

        </div>
    )
}
