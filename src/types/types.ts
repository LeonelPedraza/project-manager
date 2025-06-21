import type { ProjectType } from "@lib/enums/project-type";

export interface Profile {
    id: string
    username: string
    avatar_url: string
}
export interface Project {
    name: string
    description: string
    project_type: ProjectType
    favorite?: boolean
    id?: string
    user_id?: string
    profiles: Profile
}