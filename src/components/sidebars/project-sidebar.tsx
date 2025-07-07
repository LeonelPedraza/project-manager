import * as React from "react"
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/providers/sidebar-provider"
import { Link, useParams } from "react-router"
import { 
    House,
    Calendar, 
    Database, 
    Download, 
    Folder, 
    History, 
    LayoutList, 
    Settings, 
    StickyNote, 
    UsersRound, 
    type LucideIcon 
} from "lucide-react"

interface ISidebarItem {
    icon: LucideIcon
    title: string
    to: string
}

const sidebarItems: ISidebarItem[] = [
    {
        icon: House,
        title: "Overview",
        to: "",
    },
    {
        icon: Folder,
        title: "Documents",
        to: "documents",
    },
    {
        icon: Database,
        title: "Data Base",
        to: "database",
    },
    {
        icon: Calendar,
        title: "Calendar",
        to: "calendar",
    },
    {
        icon: UsersRound,
        title: "Team",
        to: "members",
    },
    {
        icon: LayoutList,
        title: "Tasks",
        to: "tasks",
    },
    {
        icon: StickyNote,
        title: "Notes",
        to: "notes",
    },
    {
        icon: History,
        title: "History",
        to: "history",
    },
    {
        icon: Settings,
        title: "Settings",
        to: "settings",
    },
    {
        icon: Download,
        title: "Export",
        to: "export",
    },
]


export function ProjectSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { projectId } = useParams()
    return (
        <Sidebar collapsible="icon" side="right" variant="floating" className="h-max w-52" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    {
                        sidebarItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link to={`${projectId}/${item.to}`}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    }

                </SidebarMenu>
            </SidebarHeader>
            <SidebarRail />

        </Sidebar>
    )
}
