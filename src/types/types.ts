import type { ProjectType } from "@/lib/enums/project-type"

export interface Role {
    id: string
    name: string
}

export interface Profile {
    id?: string
    username?: string
    avatar_url: string
}

export type MemberStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';

export interface ProjectMember {
    profiles: Profile
    roles: Role
    status: MemberStatus
}

export interface Invitation {
    id: string
    invited_email: string
    roles: Role
    invited_by_user_id: string
    project_id: string
    expires_at: string
}

export interface Project {
    name: string
    description: string
    project_type: ProjectType
    favorite?: boolean
    id?: string
}

export interface Projects {
    project: Project
    role: Role
    profile: Profile
}

// Duplicate Role interface removed; merged above.