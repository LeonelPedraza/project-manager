import "../globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/ui/dashboard/navbar"
import { DashboardUIContextProvider } from "@/context/dashboard-ui-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ProjectSidebar } from "@/components/ui/dashboard/project-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProjectHub - Gestión de Proyectos",
  description: "Plataforma para la gestión eficiente de proyectos y equipos",
  generator: 'v0.dev'
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <DashboardUIContextProvider>
          <SidebarProvider>
            <div className="flex min-h-dvh ">
              <div className="inset-y-0 left-0 z-40 h-full bg-background shadow-lg">
                <ProjectSidebar />
              </div>
              <main className="relative w-full h-svh">
                <Navbar user={data.user} />
                {children}
              </main>
            </div>
          </SidebarProvider>
        </DashboardUIContextProvider>
        {/* <div>
        </div> */}
        <Toaster />
      </body>
    </html>
  )
}