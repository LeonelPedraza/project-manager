import { supabase } from "@/supabase/supabase";
import type { Role } from "@/types/types";

export const getRoles = async (): Promise<Role[]> => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select(`
                id,
                name
            `)
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Role[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
        return []
    }
}