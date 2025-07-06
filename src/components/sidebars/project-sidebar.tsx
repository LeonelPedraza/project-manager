import * as React from "react"
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/providers/sidebar-provider"
import { Link } from "react-router"
import { Calendar, Database, Download, Folder, History, LayoutList, Settings, StickyNote, UsersRound, type LucideIcon } from "lucide-react"

interface ISidebarItem {
    icon: LucideIcon
    title: string
    to: string
}

const sidebarItems: ISidebarItem[] = [
    {
        icon: Folder,
        title: "Documents",
        to: "/",
    },
    {
        icon: Database,
        title: "Data Base",
        to: "/",
    },
    {
        icon: Calendar,
        title: "Calendar",
        to: "/",
    },
    {
        icon: UsersRound,
        title: "Members",
        to: "/dashboard/members",
    },
    {
        icon: LayoutList,
        title: "Tasks",
        to: "/",
    },
    {
        icon: StickyNote,
        title: "Notes",
        to: "/",
    },
    {
        icon: History,
        title: "History",
        to: "/",
    },
    {
        icon: Settings,
        title: "Settings",
        to: "/",
    },
    {
        icon: Download,
        title: "Export",
        to: "/",
    },
]


export function ProjectSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" side="right" variant="floating" className="h-max w-52" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    {
                        sidebarItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link to={item.to}>
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
