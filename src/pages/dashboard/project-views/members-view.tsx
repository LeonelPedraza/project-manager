import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MembersTable } from "@/components/members/members-table"
import { InvitationssTable } from "@/components/members/invitations-table"

export default function MembersView() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">  
                <h1 className="text-2xl">Team members</h1>
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
        </div>
    )
}