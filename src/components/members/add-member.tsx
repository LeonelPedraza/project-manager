import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserRoundPlus } from 'lucide-react'
import { AddMemberModal } from "@/components/modals/members/add-members"

export const AddMember = () => {

    const [addMemeberModalOpen, setAddMemeberModalOpen] = useState(false)

    return (
        <>
            <Button variant="outline" onClick={() => setAddMemeberModalOpen(true)}>
                <UserRoundPlus />
                Add member
            </Button>
            <AddMemberModal open={addMemeberModalOpen} onClose={() => setAddMemeberModalOpen(false)} />

        </>
    )
}