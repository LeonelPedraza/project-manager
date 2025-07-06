import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRoundPlus } from 'lucide-react'
import { AddMemberModal } from "@/components/modals/members/add-members"
import { MembersTable } from "@/components/members/members-table"
import { InvitationssTable } from "@/components/members/invitations-table"

export default function MembersView() {

    const [addMemeberModalOpen, setAddMemeberModalOpen] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
                <h1 className="text-2xl">Team members</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setAddMemeberModalOpen(true)}>
                        <UserRoundPlus />
                        Add member
                    </Button>
                </div>
            </div>
            <div>
                <Tabs defaultValue="members">
                    <TabsList>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members">
                        <MembersTable />
                    </TabsContent>
                    <TabsContent value="invitations">
                        <InvitationssTable />
                    </TabsContent>
                </Tabs>
            </div>
            <AddMemberModal open={addMemeberModalOpen} onClose={() => setAddMemeberModalOpen(false)} />
        </div>
    )
}