import { accept_invitation, getInvitations, getUserInvitations, inviteMember, removeInvitation } from "@/services/project-members"
import type { Invitation } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUser } from "../use-user"
import { PROJECTS_QUERY_KEY } from "./use-projects"

const USER_INVITATIONS_QUERY_KEY = 'user-invitations'
const INVITATIONS_QUERY_KEY = 'invitations'

export const useMemberInvitations = (projectId?: string | null) => {

    const queryClient = useQueryClient()
    const { user } = useUser()

    const { data: invitations, isLoading, isError, error } = useQuery<Invitation[]>({
        queryKey: [INVITATIONS_QUERY_KEY, projectId],
        queryFn: () => getInvitations({ projectId: projectId ?? "" }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })
    
    const userInvitations = useQuery<Invitation[]>({
            queryKey: [USER_INVITATIONS_QUERY_KEY, user?.email],
            queryFn: () => getUserInvitations(user?.email ?? ''),
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        })

    const addMember = useMutation({
        mutationFn: inviteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error inviting member:', error.message)
        }
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

    const deleteInvitation = useMutation({
        mutationFn: removeInvitation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error removing invitation:', error.message)
        }
    })

    return {
        invitations: invitations || [],
        isLoading,
        isError,
        error,
        userInvitations,
        addMember,
        acceptInvitation,
        deleteInvitation,
    }
}