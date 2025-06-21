import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet } from "react-router";


export default function AuthLayout() {
    return (
        <ThemeProvider>
            <Outlet/>
        </ThemeProvider>
    )
}