import { useQuery } from "@tanstack/react-query"
import { getProjectMembers } from "@/services/project-members"
import type { ProjectMember } from "@/types/types"

const PROJECT_MEMBERS_QUERY_KEY = 'project-members'

export const useProjectMembers = (projectId: string) => {

    const { data, isLoading, isError, error } = useQuery<ProjectMember[]>({
        queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
        queryFn: () => getProjectMembers(projectId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    return {
        projectMembers: data || [],
        isLoading,
        isError,
        error,
    }

}