import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "@/supabase/supabase"

interface IUser {
    username: string
    avatar_url: string
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<IUser>({
        username: "",
        avatar_url: "",
    })

    const loadUserData = async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            console.error(error.message)
            return
        }
        setUser(data.user)
    }

    const getUserData = async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
            console.error(error.message)
            return
        }
        const {data, error: userDataError} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
        if (userDataError) {
            console.error(userDataError.message)
            return
        }
        setUserData(data[0])
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    

    useEffect(() => {
        loadUserData()
        getUserData()
    }, [])

    return {
        user,
        userData,
        logout
    }
}