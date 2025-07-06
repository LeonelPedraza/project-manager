import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useMemberInvitations } from "@/hooks/projects/use-member-invitations"
import { useUser } from "@/hooks/use-user"

export const Profile = () => {

    const { userInvitations: {data}, acceptInvitation } = useMemberInvitations()
    return (
        <div>
            <div>
                {
                    data?.map((invitation, index) => (
                        <div key={index}>
                            <p>{invitation.projects.name}</p>
                            <p>{invitation.roles.name}</p>
                            <p>{invitation.invited_by_user_id.username}</p>
                            <Button size='sm' variant='outline' onClick={() => acceptInvitation.mutate({ invitation_id: invitation.id, project_id: invitation.project_id })}>Accept</Button>
                            <Button size='sm' variant='destructive'>Reject</Button>
                        </div>
                    ))
                }
                <pre>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>

    )
}