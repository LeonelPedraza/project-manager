import { accept_invitation, change_member_role, delete_member, get_invitations, get_project_members, get_user_invitations, invite_member, remove_invitation } from "@/services/members"
import type { Invitation, ProjectMember } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUser } from "../use-user"
import { PROJECTS_QUERY_KEY } from "../projects/use-projects"

const PROJECT_MEMBERS_QUERY_KEY = 'project-members'
const USER_INVITATIONS_QUERY_KEY = 'user-invitations'
const INVITATIONS_QUERY_KEY = 'invitations'

export const useMembers = (projectId?: string | null) => {

    const queryClient = useQueryClient()
    const { user } = useUser()

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
    
    const userInvitations = useQuery<Invitation[]>({
            queryKey: [USER_INVITATIONS_QUERY_KEY, user?.email],
            queryFn: () => get_user_invitations(user?.email ?? ''),
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
        userInvitations,
        addMember,
        changeMemberRole,
        deleteMember,
        acceptInvitation,
        deleteInvitation,
    }
}