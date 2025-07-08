import * as React from "react"
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/providers/sidebar-provider"
import { Link, useParams } from "react-router"
import { sidebarItems } from "@/lib/sidebar-items"


export function ProjectSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { projectId } = useParams()
    return (
        <Sidebar 
            collapsible="icon" 
            side="right" 
            variant="floating" 
            className="h-max duration-100" 
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    {
                        sidebarItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
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
        </Sidebar>
    )
}
