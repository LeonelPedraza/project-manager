import { useEffect } from "react";
import { AppSidebar } from "@/components/sidebars/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { Outlet, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@/hooks/use-user";
import { ProjectSidebar } from "@/components/sidebars/project-sidebar";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/providers/sidebar-provider";
import { useAppState } from "@/hooks/use-app-state";

export default function DashboardLayout() {

    const queryClient = new QueryClient();
    const navigate = useNavigate()
    const { userData } = useUser()

    const { leftSidebarOpen, setLeftSideBarOpen, rightSidebarOpen, setRightSideBarOpen, selectedProject } = useAppState()

    useEffect(() => {
        if (!userData) {
            navigate('/', { replace: true })
        }
    }, [userData, navigate])

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system">
                <SidebarProvider open={leftSidebarOpen}>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger onClick={() => setLeftSideBarOpen(!leftSidebarOpen)} className="-ml-1">
                                    <PanelLeftIcon />
                                </SidebarTrigger>
                                <SidebarTrigger onClick={() => setRightSideBarOpen(!rightSidebarOpen)} className="-ml-1">
                                    <PanelRightIcon />
                                </SidebarTrigger>
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 data-[orientation=vertical]:h-4"
                                />
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
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </SidebarProvider>
                {
                    selectedProject &&
                    <SidebarProvider open={rightSidebarOpen}>
                        <ProjectSidebar />
                    </SidebarProvider>
                }
                <Toaster />
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </QueryClientProvider>
    )
}