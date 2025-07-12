import { cn } from "@/utils/utils"
import { Input } from "./input"
import { Search } from "lucide-react"

export const SearchInput = ({ className, type, ...props }: React.ComponentProps<"input">) => {
    return (
        <div className="relative w-full flex items-center">
            <Input
                type={type}
                className={cn("max-w-sm pl-8", className)} 
                {...props}
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </div>
    )
}