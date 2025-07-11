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
    id?: string
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
    id?: string
    owner: Profile
    name: string
    description: string
    project_type: ProjectType
    favorite?: boolean
}

export interface Projects {
    project: Project
    profile: Profile
}

export interface Folder {
    id: string
    name: string
    drive_folder_id: string
    folder_url: string
    parent_folder_id?: string
    project_id: string
}

type FileType = "doc" | "sheet" | "ppt";

export interface Document {
    id: string
    name: string
    file_type: FileType
    drive_file_id: string
    drive_file_url: string
    parent_folder_id?: string
    status: string
}

// Duplicate Role interface removed; merged above.