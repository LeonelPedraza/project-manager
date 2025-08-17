import { supabase } from "@/supabase/supabase"
import type { TaskStage } from "@/types/tasks.types"

export const getTasks = async ({ projectId }: { projectId: string }) => {
    try {
        const { data, error } = await supabase.rpc('get_project_stages_with_cards', { _project_id: projectId })

        if (error) {
            throw Error(error.message)
        }
        // console.log(data)
        return data as unknown as TaskStage[]
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al obtener el proyecto:', error.message);
        } else {
            console.error('Error al obtener el proyecto:', error);
        }
        return null;
    }
}

interface NewStageData {
    title: string
    position: number
}
export const createStage = async ({ projectId, stageData }: { projectId: string, stageData: NewStageData }) => {
    try {
        const { data, error } = await supabase.from('task_stages').insert({
            project_id: projectId,
            title: stageData.title,
            position: stageData.position,
        })
        .select()
        .single()
        if (error) {
            throw Error(error.message)
        }
        return {...data, cards: []}
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al crear el proyecto:', error.message);
        } else {
            console.error('Error al crear el proyecto:', error);
        }
        return null;
    }
}

interface NewCardData {
    title: string
    position: number
    stageId: string
}
export const createCard = async ({ cardData }: { cardData: NewCardData }) => {
    try {
        const { data, error } = await supabase.from('task_cards').insert({
            title: cardData.title,
            position: cardData.position,
            stage_id: cardData.stageId,
        })
        .select()
        .single()
        if (error) {
            throw Error(error.message)
        }
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error al crear la tarea:', error.message);
        } else {
            console.error('Error al crear la tarea:', error);
        }
        return null;
    }
}


/**
   * Mueve una tarjeta y actualiza las posiciones en el servidor
   */
export interface MoveCardData {
    cardId: string
    sourceStageId: string
    targetStageId: string
    sourcePosition: number
    targetPosition: number
    projectId: string
}
export const moveCard = async (data: MoveCardData): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: response, error } = await supabase.functions.invoke('move_card', {
            body: data
        })

        if (error) {
            throw new Error(error.message || 'Error moviendo tarjeta')
        }
        console.log(response)
        return { success: true }
    } catch (error) {
        console.error('❌ Error en moveCard:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}

/**
 * Mueve una columna y actualiza las posiciones en el servidor
 */
export interface MoveColumnData {
    columnId: string
    sourcePosition: number
    targetPosition: number
    projectId: string
}
export const moveColumn = async (data: MoveColumnData): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: response, error } = await supabase.functions.invoke('move_column', {
            body: data
        })

        if (error) {
            throw new Error(error.message || 'Error moviendo columna')
        }
        console.log(response)

        return { success: true }
    } catch (error) {
        console.error('❌ Error en moveColumn:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}

/**
 * Carga el tablero completo desde el servidor
 */
export const getTasksFromServer = async ({ projectId }: { projectId: string }) => {
    try {
        // Cargar columnas ordenadas por posición
        const { data: stages, error: stagesError } = await supabase
            .from('task_stages')
            .select('*')
            .eq('project_id', projectId)
            .order('position', { ascending: true })

        if (stagesError) throw stagesError

        // Cargar tarjetas ordenadas por posición
        const { data: cards, error: cardsError } = await supabase
            .from('task_cards')
            .select('*')
            .eq('project_id', projectId)
            .order('position', { ascending: true })

        if (cardsError) throw cardsError

        return { stages: stages || [], cards: cards || [] }
    } catch (error) {
        console.error('❌ Error cargando tablero:', error)
        throw error
    }
}

// export const getTasksCardsByStage = async ({stage_id}: {stage_id: string}) => {
//     try {
//         const {data, error} = await supabase
//             .from('task_cards')
//             .select(`*`)
//             .eq('stage_id', stage_id)
//             .order('position', { ascending: true })
//         if (error) {
//             throw Error(error.message)
//         }
//         return data as unknown as TDraggableCard[]
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error al obtener el proyecto:', error.message);
//         } else {
//             console.error('Error al obtener el proyecto:', error);
//         }
//         return null;
//     }
// }