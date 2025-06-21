import { GalleryVerticalEnd } from "lucide-react"


export const LoginFormHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
            >
                <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            {children}
        </div>
    )
}