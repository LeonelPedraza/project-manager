"use client"

import { useState, useEffect, useContext } from "react"
import {
  Plus,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  PanelRight,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInput,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { CreateProjectModal } from "@/components/modals/projects/create-project-modal"
import { EditProjectModal } from "@/components/modals/projects/edit-project-modal"
import { DeleteProjectModal } from "@/components/modals/projects/delete-project-modal"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { DashboardUIContext } from "@/context/dashboard-ui-context"

const SIDEBAR_WIDTH_ICON = "3.8rem"
const SIDEBAR_WIDTH = "16rem"

interface Project {
  id: string
  name: string
  description?: string
  type?: string
  isFavorite?: boolean
}

// Datos de ejemplo
const initialProjects: Project[] = [
  { id: "1", name: "Sistema de Ventas", type: "software", isFavorite: true },
  { id: "2", name: "Aplicación Móvil", type: "software", isFavorite: false },
  { id: "3", name: "Portal Web", type: "software", isFavorite: true },
  { id: "4", name: "API REST", type: "software", isFavorite: false },
  { id: "5", name: "Dashboard Analytics", type: "business", isFavorite: false },
]


export function ProjectSidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const { selectedProjectId, setSelectedProjectId } = useContext(DashboardUIContext)
  const { open, setOpen } = useSidebar()
  const { isMobile, isTablet } = useMobile()
  const { toast } = useToast()

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const favoriteProjects = filteredProjects.filter((project) => project.isFavorite)
  const nonFavoriteProjects = filteredProjects.filter((project) => !project.isFavorite)

  const handleCreateProject = (project: { name: string; description: string; type: string }) => {
    const newProject = {
      id: `${Date.now()}`, // Usar timestamp como ID único
      name: project.name,
      description: project.description,
      type: project.type,
      isFavorite: false,
    }

    setProjects([...projects, newProject])

    

    // Seleccionar automáticamente el nuevo proyecto
    setSelectedProjectId(newProject.id)
  }

  const handleEditProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setProjectToEdit(project)
      setIsEditModalOpen(true)
    }
  }

  const handleUpdateProject = (projectId: string, updatedData: { name: string; description: string; type: string }) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
          ...project,
          name: updatedData.name,
          description: updatedData.description,
          type: updatedData.type,
        }
        : project,
    )

    setProjects(updatedProjects)

    toast({
      title: "Proyecto actualizado",
      description: `El proyecto "${updatedData.name}" ha sido actualizado exitosamente.`,
    })
  }

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setProjectToDelete(project)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return

    // Simulamos una operación asíncrona
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedProjects = projects.filter((project) => project.id !== projectToDelete.id)
    setProjects(updatedProjects)

    toast({
      title: "Proyecto eliminado",
      description: `El proyecto "${projectToDelete.name}" ha sido eliminado.`,
      variant: "destructive",
    })

    // Si el proyecto eliminado era el seleccionado, deseleccionamos
    if (selectedProjectId === projectToDelete.id) {
      setSelectedProjectId(null)
    }
  }

  const toggleFavorite = (projectId: string) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
          ...project,
          isFavorite: !project.isFavorite,
        }
        : project,
    )

    setProjects(updatedProjects)

    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const action = project.isFavorite ? "eliminado de" : "añadido a"
      toast({
        title: `Proyecto ${action} favoritos`,
        description: `"${project.name}" ha sido ${action} tus favoritos.`,
      })
    }
  }

  // Componente para renderizar un proyecto en la lista
  const ProjectItem = ({ project }: { project: Project }) => (
    <SidebarMenuItem key={project.id} className="group">
      <div className="flex w-full items-center justify-between">
        <SidebarMenuButton
          isActive={selectedProjectId === project.id}
          onClick={() => setSelectedProjectId(project.id)}
          className={cn("flex-1", !open && !isMobile ? "justify-center" : "")}
          tooltip={project.name}
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 flex-shrink-0" />
            {
              open && (
                <span className="truncate">{project.name}</span>
              )

            }
          </div>
        </SidebarMenuButton>

        {(open || isMobile) && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-opacity",
                project.isFavorite ? "text-yellow-500" : "opacity-0 group-hover:opacity-100",
              )}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(project.id)
              }}
              title={project.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {project.isFavorite ? <Star className="h-4 w-4 fill-yellow-500" /> : <Star className="h-4 w-4" />}
              <span className="sr-only">{project.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Opciones para {project.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleFavorite(project.id)}>
                  {project.isFavorite ? (
                    <>
                      <StarOff className="mr-2 h-4 w-4" />
                      Quitar de favoritos
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Añadir a favoritos
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar proyecto
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar proyecto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </SidebarMenuItem>
  )

  useEffect(() => {
    if (selectedProjectId && !isMobile && !isTablet) {
      setOpen(false)
    } else if (!selectedProjectId && !isMobile && !isTablet) {
      setOpen(true)
    }
  }, [selectedProjectId, isMobile, isTablet])

  useEffect(() => {
    if (isMobile) {
      setOpen(false)
      // setRightSidebarVisible(false)
    } else {
      setOpen(true)
      // setRightSidebarVisible(true)
    }
  }, [isMobile])

  return (
    <>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar"
        )}
      >
        <div
          className={cn("group relative group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar")}
        >
          <Sidebar side="left" variant="sidebar" collapsible="icon" className="h-full">
            <SidebarHeader className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="font-bold">PH</span>
                </div>
                {(open || isMobile) && (
                    <span className="hidden font-bold md:inline-block">ProjectHub</span>
                )}
              </div>

            </SidebarHeader>

            <SidebarContent className="h-full">
              {(open || isMobile) && (
                <SidebarGroup>
                  <div className="px-2 pb-2">
                    <SidebarInput
                      placeholder="Buscar proyectos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    // startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                    />
                  </div>
                </SidebarGroup>
              )}

              {favoriteProjects.length > 0 && (
                <SidebarGroup>
                  {(open || isMobile) && (
                    <SidebarGroupLabel className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                      <span className="truncate">Proyectos Favoritos</span>
                    </SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {favoriteProjects.map((project) => (
                        <ProjectItem key={project.id} project={project} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              <SidebarGroup>
                {(open || isMobile) && (
                  <SidebarGroupLabel>
                    <span className="truncate">
                      {favoriteProjects.length > 0 ? "Todos los Proyectos" : "Mis Proyectos"}
                    </span>
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {nonFavoriteProjects.map((project) => (
                      <ProjectItem key={project.id} project={project} />
                    ))}
                    {filteredProjects.length === 0 && (open || isMobile) && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No se encontraron proyectos</div>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <div className="">
                <Button
                  className={cn("w-full", !open && !isMobile ? "justify-center items-center" : "")}
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Nuevo Proyecto"
                >
                  <Plus className={cn("h-5 w-5", !open && !isMobile ? "" : "mr-2")} />
                  {(open || isMobile) && <span>Nuevo Proyecto</span>}
                </Button>
              </div>
            </SidebarFooter>

          </Sidebar>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setProjectToEdit(null)
        }}
        onUpdateProject={handleUpdateProject}
        project={projectToEdit}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProjectToDelete(null)
        }}
        onConfirm={confirmDeleteProject}
        projectName={projectToDelete?.name || ""}
      />
    </>
  )
}
