import { useState } from "react"
import { Link } from "react-router"

import {
  Forward,
  LoaderCircle,
  MoreHorizontal,
  SquarePen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/providers/sidebar-provider"
import { useProjects } from "@/hooks/projects/use-projects"
import type { Project, Projects } from "@/types/types"
import { EditProjectModal } from "@/components/modals/projects/edit-project"
import { DeleteProjectModal } from "@/components/modals/projects/delete-project"
import { useAppState } from "@/hooks/use-app-state"
import { useSidebar } from "@/hooks/use-sidebar"

export function NavProjects() {
  const { isMobile, open } = useSidebar()
  const { projects, isLoading = true } = useProjects()
  const { selectedProject, setSelectedProject, setLeftSideBarOpen } = useAppState()

  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null)
  const [updateProjectModalOpen, setUpdateProjectModalOpen] = useState(false)

  const handleUpdateProject = (project: Project) => {
    setProjectToUpdate(project)
    setUpdateProjectModalOpen(true)
  }

  const handleSelectProject = (project: Projects) => {
    setSelectedProject(project)
    setLeftSideBarOpen(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu className={!open ? 'gap-2' : ''}>
        {
          isLoading &&
          <span className="text-xs items-center flex gap-2 justify-center text-muted-foreground">
            <LoaderCircle className="animate-spin size-4" />
            Loading projects...
          </span>
        }
        {
          !isLoading && projects.length === 0 &&
          <span className="text-xs items-center flex gap-2 justify-center text-muted-foreground">
            No projects found
          </span>
        }
        {
          projects.map((item) => (
            <SidebarMenuItem key={item.project.id} className="cursor-pointer">
              <SidebarMenuButton asChild size='lg' onClick={() => handleSelectProject(item)} tooltip={item.project.name} isActive={item.project.id === selectedProject?.project.id} >
                <Link to={`/dashboard/project`}>
                  <div className="h-full flex items-center gap-2">
                    <img src={item.profile.avatar_url} alt={`${item.profile.username}'s avatar`} className="object-cover size-8 w-8 rounded-sm" /> 
                    <div className="flex flex-col gap-1">
                      <span>{item.project.name}</span>
                      <span className="text-xs text-muted-foreground">{item.profile.username}</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleUpdateProject(item.project)}>
                    <SquarePen className="text-muted-foreground" />
                    <span>Edit Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteProjectModal project={item.project} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
      {projectToUpdate && <EditProjectModal project={projectToUpdate} open={updateProjectModalOpen} onClose={() => setUpdateProjectModalOpen(false)} setProjectToUpdate={setProjectToUpdate} />}
    </SidebarGroup>
  )
}
