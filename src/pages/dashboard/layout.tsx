import { AppSidebar } from "@/components/sidebars/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, Outlet, useParams } from "react-router";
import { PanelLeftIcon, Menu } from "lucide-react";
import { SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/providers/sidebar-provider";
import { useAppState } from "@/hooks/use-app-state";
import { ProjectProvider } from "@/providers/project-provider";
import { ProjectSidebar } from "@/components/sidebars/project-sidebar";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import { sidebarItems } from "@/lib/sidebar-items"
import { useEffect } from "react";

export default function DashboardLayout() {

    const { projectId } = useParams()
    const { leftSidebarOpen, setLeftSideBarOpen, rightSidebarOpen, setRightSideBarOpen } = useAppState()

    useEffect(() => {
        if (projectId) {
            setLeftSideBarOpen(false)
        }
    }, [projectId, setLeftSideBarOpen])

    return (
        <ProjectProvider projectId={projectId ?? ""}>
            <SidebarProvider open={leftSidebarOpen}>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex w-full justify-between items-center gap-2 px-4 md:px-8">
                            <div className="flex items-center">
                                <SidebarTrigger
                                    onClick={() => setLeftSideBarOpen(!leftSidebarOpen)}
                                    className="-ml-1 mr-2"
                                >
                                    <PanelLeftIcon />
                                </SidebarTrigger>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Building Your Application
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            {/* Mobile Sidebar */}
                            {
                                projectId &&
                                <Drawer>
                                    <DrawerTrigger className="md:hidden">
                                        <Menu />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <SidebarMenu className="px-4 pt-8 pb-16">
                                            {sidebarItems.map((item) => (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton asChild tooltip={item.title}>
                                                        <Link to={`${projectId}/${item.to}`}>
                                                            <DrawerClose className="flex gap-4">
                                                                <item.icon size={20} />
                                                                <span>{item.title}</span>
                                                            </DrawerClose>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </DrawerContent>
                                </Drawer>
                            }
                        </div>
                    </header>
                    <div className="flex-col gap-4 py-4 px-4 md:px-8">
                        <Outlet />
                    </div>
                </SidebarInset>
                {projectId && (
                    <SidebarProvider
                        open={rightSidebarOpen}
                        className="static hidden md:inline-flex w-max max-h-max"
                    >
                        <ProjectSidebar
                            onMouseEnter={() => setRightSideBarOpen(true)}
                            onMouseLeave={() => setRightSideBarOpen(false)}
                        />
                    </SidebarProvider>
                )}
            </SidebarProvider>
        </ProjectProvider>
    );
}