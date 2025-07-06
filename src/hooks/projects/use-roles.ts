import { useQuery } from "@tanstack/react-query"

import { getRoles } from "@/services/roles"
import type { Role } from "@/types/types"

const ROLES_QUERY_KEY = 'roles'

export const useRoles = () => {
    
    const { data, isLoading, isError, error } = useQuery<Role[]>({
        queryKey: [ROLES_QUERY_KEY],
        queryFn: () => getRoles(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    return {
        roles: data || [],
        isLoading,
        isError,
        error,
    }

}