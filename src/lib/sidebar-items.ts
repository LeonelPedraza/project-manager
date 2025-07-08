
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

export const sidebarItems: ISidebarItem[] = [
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