import { useUser } from "../use-user"
import { PROJECTS_QUERY_KEY } from "../projects/use-projects"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Invitation } from "@/types/types"
import { accept_invitation, get_user_invitations } from "@/services/members"

const USER_INVITATIONS_QUERY_KEY = 'user-invitations'

export const useUserInvitations = () => {

    const { user } = useUser()
    const queryClient = useQueryClient()

    const userInvitations = useQuery<Invitation[]>({
        queryKey: [USER_INVITATIONS_QUERY_KEY, user?.email],
        queryFn: () => get_user_invitations(user?.email ?? ''),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const acceptInvitation = useMutation({
        mutationFn: accept_invitation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [USER_INVITATIONS_QUERY_KEY, user?.email] })
            queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] })
        },
        onError: (error) => {
            console.error('Error accepting invitation:', error.message)
        }
    })

    return {
        userInvitations,
        acceptInvitation,
    }

}