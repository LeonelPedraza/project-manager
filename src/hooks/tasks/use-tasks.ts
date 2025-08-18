import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCard, createStage, deleteCard, deleteStage, getTasks } from "@/services/tasks"
import type { TaskStage } from "@/types/tasks.types"
// import type { TDraggableCard, TDraggableColumn } from "@/types/tasks.types"

export const TASKS_STAGES_QUERY_KEY = 'tasks-stages'

export const useTasks = ({projectId}: {projectId: string}) => {

    const queryClient = useQueryClient()

    const stages = useQuery({
        queryKey: [TASKS_STAGES_QUERY_KEY, projectId],
        queryFn: () => getTasks({ projectId: projectId }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const removeStage = useMutation({
        mutationFn: deleteStage,
        onSuccess: (stageId) => {
            queryClient.setQueryData([TASKS_STAGES_QUERY_KEY, projectId], (oldStages: TaskStage[]) => {
                return oldStages.filter((stage) => stage.id !== stageId)
            })
        },
        onError: (error) => {
            console.error('Error deleting stage:', error.message)
            return error
        }
    })

    const addStage = useMutation({
        mutationFn: createStage,
        onSuccess: (stage) => {
            queryClient.setQueryData([TASKS_STAGES_QUERY_KEY, projectId], (oldStages: TaskStage[]) => {
                return [...oldStages, stage]
            })
        },
        onError: (error) => {
            console.error('Error creating stage:', error.message)
            return error
        }
    })

    const addCard = useMutation({
        mutationFn: createCard,
        onSuccess: (card) => {
            queryClient.setQueryData([TASKS_STAGES_QUERY_KEY, projectId], (oldStages: TaskStage[]) => {
                return oldStages.map(stage => {
                    if (stage.id === card.stage_id) {
                        return {
                            ...stage,
                            cards: [...stage.cards, card]
                        }
                    }
                    return stage
                })
            })
        },
        onError: (error) => {
            console.error('Error creating card:', error.message)
            return error
        }
    })

    const removeCard = useMutation({
        mutationFn: deleteCard,
        onSuccess: (cardId) => {
            queryClient.setQueryData([TASKS_STAGES_QUERY_KEY, projectId], (oldStages: TaskStage[]) => {
                return oldStages.map((stage) => {
                    return {
                        ...stage,
                        cards: stage.cards.filter((card) => card.id !== cardId)
                    }
                })
            })
        },
        onError: (error) => {
            console.error('Error deleting card:', error.message)
            return error
        }
    })

    return {
        stages: stages.data || [],
        loading: stages.isLoading,
        error: stages.error,
        refetch: stages.refetch,
        addStage,
        removeStage,
        addCard,
        removeCard
    }

}