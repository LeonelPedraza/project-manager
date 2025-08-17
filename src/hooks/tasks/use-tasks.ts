import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCard, createStage, getTasks } from "@/services/tasks"
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

    return {
        stages: stages.data || [],
        loading: stages.isLoading,
        error: stages.error,
        refetch: stages.refetch,
        addStage,
        addCard
    }

}