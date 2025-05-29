import { createClient } from "@/lib/supabase/client"

type Providers = "google" | "github"

export const useOAuthProvider = ({provider}: {provider: Providers}) => {
        const supabase = createClient()
        supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/oauth/callback`,
            },
        })
    }