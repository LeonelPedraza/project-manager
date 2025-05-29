import "../globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/dashboard/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProjectHub - Gestión de Proyectos",
  description: "Plataforma para la gestión eficiente de proyectos y equipos",
  generator: 'v0.dev'
}

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar user={data.user}/>
        <main>
          {children}
        </main>
          <Toaster />
      </body>
    </html>
  )
}