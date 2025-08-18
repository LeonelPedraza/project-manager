import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  PackagePlus
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/providers/sidebar-provider"
import { TeamSwitcher } from "./team-switcher"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { SearchForm } from "./search-form"
import { NewProjectModal } from "@/components/projects/create-project"
import { useState } from "react"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
}

const NewProjectButton = () => {
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false)
  return (
    <>
      <SidebarMenuButton onClick={() => setCreateProjectModalOpen(true)} size="lg" className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground cursor-pointer pointer-events-auto select-none active:bg-sidebar-primary/75 active:text-sidebar-primary-foreground">
        <div className="flex aspect-square size-8 items-center justify-center">
          <PackagePlus className="size-5" />
        </div>
        <span className="truncate font-medium">New Project</span>
      </SidebarMenuButton>
      <NewProjectModal open={createProjectModalOpen} onClose={() => setCreateProjectModalOpen(false)} />
    </>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="">
            <NewProjectButton />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex flex-row items-center gap-2">
          <NavUser />          
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
