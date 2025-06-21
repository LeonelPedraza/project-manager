import { Button } from "@/components/ui/button";
import { Link } from "react-router";


export default function ConfirmEmail() {
    return (
        <div>
            <h1>Confirm Email</h1>
            <Button>
                <Link to="/" className="">Go to Sign In</Link>
            </Button>
        </div>
    )
}