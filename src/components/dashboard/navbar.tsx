"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";

import {
  Bell,
  ChevronDown,
  Globe,
  LogOut,
  Settings,
  User,
  Check,
  Info,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Filter,
  MoreHorizontal,
  CheckCheck,
  ExternalLink,
} from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"
// import { SupabaseUser } from "@/types/types"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client";

// Datos de ejemplo para notificaciones
const notifications = [
  {
    id: 1,
    title: "Nueva tarea asignada",
    description: "Se te ha asignado la tarea 'Implementar autenticación'",
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    type: "info",
    read: false,
    project: "Sistema de Ventas",
    actionUrl: "#",
  },
  {
    id: 2,
    title: "Comentario en tarea",
    description: "Carlos comentó en la tarea 'Diseño de UI'",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    type: "info",
    read: false,
    project: "Portal Web",
    actionUrl: "#",
  },
  {
    id: 3,
    title: "Reunión en 15 minutos",
    description: "Reunión de planificación con el equipo de desarrollo",
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
    type: "warning",
    read: false,
    project: "API REST",
    actionUrl: "#",
  },
  {
    id: 4,
    title: "Tarea completada",
    description: "Miguel ha completado la tarea 'Configuración de base de datos'",
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 horas atrás
    type: "success",
    read: true,
    project: "Sistema de Ventas",
    actionUrl: "#",
  },
  {
    id: 5,
    title: "Error en despliegue",
    description: "El despliegue a producción ha fallado. Revisa los logs.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
    type: "error",
    read: true,
    project: "Aplicación Móvil",
    actionUrl: "#",
  },
  {
    id: 6,
    title: "Nuevo miembro en el equipo",
    description: "Laura García se ha unido al proyecto",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    type: "info",
    read: true,
    project: "Dashboard Analytics",
    actionUrl: "#",
  },
  {
    id: 7,
    title: "Actualización disponible",
    description: "Nueva versión del sistema disponible (v2.3.0)",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 días atrás
    type: "info",
    read: true,
    project: "Sistema de Ventas",
    actionUrl: "#",
  },
]

interface NavbarProps {
  user: SupabaseUser;
  onSelectOption?: (option: string) => void
}

export function Navbar({ user, onSelectOption }: NavbarProps) {
  const router = useRouter();

  const [notificationsList, setNotificationsList] = useState(notifications)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Contar notificaciones no leídas
  const unreadCount = notificationsList.filter((notification) => !notification.read).length

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Marcar una notificación como leída
  const markAsRead = (id: number) => {
    setNotificationsList(
      notificationsList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  // Eliminar una notificación
  const removeNotification = (id: number) => {
    setNotificationsList(notificationsList.filter((notification) => notification.id !== id))
  }

  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  // Obtener color de fondo según el tipo de notificación
  const getNotificationBackground = (type: string, read: boolean) => {
    if (read) return ""

    switch (type) {
      case "info":
        return "bg-blue-50 dark:bg-blue-950/20"
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/20"
      case "success":
        return "bg-green-50 dark:bg-green-950/20"
      case "error":
        return "bg-red-50 dark:bg-red-950/20"
      default:
        return "bg-blue-50 dark:bg-blue-950/20"
    }
  }

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6 inset-x-0">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="font-bold">PH</span>
        </div>
        <span className="hidden font-bold md:inline-block">ProjectHub</span>
      </div>

      <div className="flex items-center">
        <ThemeSwitcher/>
        <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5"/>
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[380px] p-0" align="end">
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="font-semibold">Notificaciones</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Filtrar">
                  <Filter className="h-4 w-4" />
                </Button>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                    <CheckCheck className="mr-1 h-4 w-4" />
                    Marcar todo como leído
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Todas
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  No leídas
                </TabsTrigger>
                <TabsTrigger
                  value="mentions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Menciones
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[300px]">
                  {notificationsList.length > 0 ? (
                    <div>
                      {notificationsList.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50",
                            getNotificationBackground(notification.type, notification.read),
                          )}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {/* {formatDistanceToNow(notification.time, { addSuffix: true, locale: es })} */}
                                  </span>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span>{notification.project}</span>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.read && (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Check className="mr-2 h-4 w-4" />
                                      Marcar como leída
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem asChild>
                                    <a href={notification.actionUrl}>Ver detalles</a>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => removeNotification(notification.id)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <div>
                        <Bell className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                        <h3 className="mt-2 text-lg font-medium">No hay notificaciones</h3>
                        <p className="text-sm text-muted-foreground">
                          Las notificaciones aparecerán aquí cuando haya actividad en tus proyectos.
                        </p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="unread" className="m-0">
                <ScrollArea className="h-[300px]">
                  {notificationsList.filter((n) => !n.read).length > 0 ? (
                    <div>
                      {notificationsList
                        .filter((notification) => !notification.read)
                        .map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "flex items-start gap-3 border-b p-3 transition-colors hover:bg-muted/50",
                              getNotificationBackground(notification.type, notification.read),
                            )}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-medium">{notification.title}</h4>
                                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {/* {formatDistanceToNow(notification.time, { addSuffix: true, locale: es })} */}
                                    </span>
                                    <Separator orientation="vertical" className="h-3" />
                                    <span>{notification.project}</span>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Check className="mr-2 h-4 w-4" />
                                      Marcar como leída
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <a href={notification.actionUrl}>Ver detalles</a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => removeNotification(notification.id)}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <div>
                        <CheckCheck className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                        <h3 className="mt-2 text-lg font-medium">No hay notificaciones sin leer</h3>
                        <p className="text-sm text-muted-foreground">Todas tus notificaciones han sido leídas.</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="mentions" className="m-0">
                <div className="flex h-[300px] items-center justify-center p-6 text-center">
                  <div>
                    <User className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No hay menciones</h3>
                    <p className="text-sm text-muted-foreground">
                      Las menciones aparecerán aquí cuando alguien te etiquete en un comentario.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setIsNotificationsOpen(false)
                  onSelectOption && onSelectOption("notifications")
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver todas las notificaciones
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata.avatar_url} alt="Usuario" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user.user_metadata.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSelectOption && onSelectOption("profile")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectOption && onSelectOption("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Idioma</DropdownMenuLabel>
            <DropdownMenuItem>
              <Globe className="mr-2 h-4 w-4" />
              Español
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Globe className="mr-2 h-4 w-4" />
              English
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
