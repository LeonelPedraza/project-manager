import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Laptop, Moon, Sun } from "lucide-react"
import { type Theme } from "@/context/theme-context"
import { useTheme } from "@/hooks/use-theme";

const ICON_SIZE = 24;

export const ThemeSwitcher = () => {

    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {theme === "light" ? (
                        <Sun
                            key="light"
                            size={ICON_SIZE}
                            className={"text-muted-foreground"}
                        />
                    ) : theme === "dark" ? (
                        <Moon
                            key="dark"
                            size={ICON_SIZE}
                            className={"text-muted-foreground"}
                        />
                    ) : (
                        <Laptop
                            key="system"
                            size={ICON_SIZE}
                            className={"text-muted-foreground"}
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-content" align="start">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                >
                    <DropdownMenuRadioItem className="flex gap-2" value="light">
                        <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
                        <span>Light</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="flex gap-2" value="dark">
                        <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
                        <span>Dark</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem className="flex gap-2" value="system">
                        <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
                        <span>System</span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}