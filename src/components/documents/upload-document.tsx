import { Button } from "../ui/button"
import { FileUp } from "lucide-react"

export const UploadDocument = () => {
    return (
        <>
            <Button>
                <FileUp />
                Upload Document
            </Button>
        </>
    )
}