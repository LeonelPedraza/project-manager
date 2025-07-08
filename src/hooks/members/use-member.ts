import { change_member_role, delete_member, get_invitations, get_project_members, invite_member, remove_invitation } from "@/services/members"
import type { Invitation, ProjectMember } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


const PROJECT_MEMBERS_QUERY_KEY = 'project-members'
const INVITATIONS_QUERY_KEY = 'invitations'

export const useMembers = (projectId?: string | null) => {

    const queryClient = useQueryClient()

    const members = useQuery<ProjectMember[]>({
        queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
        queryFn: () => get_project_members(projectId ?? ''),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })

    const invitations = useQuery<Invitation[]>({
        queryKey: [INVITATIONS_QUERY_KEY, projectId],
        queryFn: () => get_invitations({ projectId: projectId ?? "" }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })    

    const addMember = useMutation({
        mutationFn: invite_member,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [INVITATIONS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error inviting member:', error.message)
        }
    })

    const changeMemberRole = useMutation({
        mutationFn: change_member_role,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error changing member role:', error.message)
        }
    })

    const deleteMember = useMutation({
        mutationFn: delete_member,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error deleting member:', error.message)
        }
    })

    const deleteInvitation = useMutation({
        mutationFn: remove_invitation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId] })
        },
        onError: (error) => {
            console.error('Error removing invitation:', error.message)
        }
    })

    return {
        members,
        invitations,
        addMember,
        changeMemberRole,
        deleteMember,
        deleteInvitation,
    }
}