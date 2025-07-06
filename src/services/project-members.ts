import { supabase } from "@/supabase/supabase";
import { type Invitation, type ProjectMember } from "@/types/types";

export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
    try {
        const { data, error } = await supabase
            .from('members')
            .select(`
                profiles (username, avatar_url),
                roles (name)
            `)
            .eq('project_id', projectId)
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as ProjectMember[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
        return []
    }
}

export const getInvitations = async ({projectId}: {projectId: string}): Promise<Invitation[]> => {
    try {
        const { data, error } = await supabase
            .from('invitations')
            .select(`
                id,
                invited_email,
                status,
                roles (name),
                invited_by_user_id:profiles (username)
            `)
            .eq('project_id', projectId)
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Invitation[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
        return []
    }
}

export const getUserInvitations = async (email: string): Promise<Invitation[]> => {
    try {
        const { data, error } = await supabase
            .from('invitations')
            .select(`
                id,
                project_id,
                projects (name),
                roles (name),
                invited_by_user_id:profiles (username)
            `)
            .eq('status', 'PENDING')
            .eq('invited_email', email)
        if (error) {
            throw Error(error.message)
        }
        return data as unknown as Invitation[]
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
        return []
    }
}

interface InviteMemberParams {
    project_id: string
    invited_email: string
    role_id: string
}
export const inviteMember = async ({ project_id, invited_email, role_id }: InviteMemberParams) => {
    try {
        const { data: { user} } = await supabase.auth.getUser()
        const { data, error } = await supabase.functions.invoke('invite-user', {
            body: {
                invited_email,
                project_id,
                role_id,
                invited_by_user_id: user?.id
            }
        })
        if (error) {
            throw Error(error.message)
        }
        console.log(data)
        return
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}

export const accept_invitation = async ({ invitation_id, project_id }: { invitation_id: string, project_id: string }) => {
    try {
        const { data: { user} } = await supabase.auth.getUser()
        const { error } = await supabase.functions.invoke('accept-invitation', {
            body: {
                invitation_id,
                project_id,
                user_id: user?.id
            }
        })
        if (error) {
            throw Error(error.message)
        }
        return
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}

export const removeInvitation = async ({ id }: { id: string }) => {
    try {
        const { error } = await supabase
            .from('invitations')
            .delete()
            .eq('id', id)
        if (error) {
            throw Error(error.message)
        }
        return
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
            throw error
        }
    }
}