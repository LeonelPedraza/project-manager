import { Search } from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarInput,
} from "@/providers/sidebar-provider"
export function SearchForm({ ...props }: React.ComponentProps<"form">) {
    return (
        <form {...props}>
            <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
                <SidebarGroupContent className="relative">
                    <SidebarInput
                        id="search"
                        placeholder="Search project"
                        className="pl-8"
                    />
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}
