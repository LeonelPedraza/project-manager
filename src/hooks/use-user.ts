import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase"; // Asegúrate de que esta ruta sea correcta

interface IUserProfile { // Renombrado a IUserProfile para evitar confusión con User de Supabase
    username: string;
    avatar_url: string;
    // Añade aquí cualquier otro campo que selecciones de la tabla 'profiles'
    id: string; // El ID del perfil será el mismo que el ID del usuario
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null); // Usamos null como valor inicial
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Obtener el usuario de autenticación
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                if (authError) {
                    setError(authError);
                    setUser(null);
                    setUserProfile(null);
                    setLoading(false);
                    return;
                }

                setUser(authUser);

                // 2. Si hay un usuario, obtener su perfil
                if (authUser) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', authUser.id)
                        .single(); // Usa .single() si esperas un solo resultado

                    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 es "No rows found"
                        setError(profileError);
                        setUserProfile(null);
                    } else if (profileData) {
                        setUserProfile(profileData as IUserProfile); // Asegúrate de que los tipos coincidan
                    } else {
                        setUserProfile(null); // No se encontró perfil
                    }
                } else {
                    setUserProfile(null); // Si no hay usuario de auth, no hay perfil
                }

            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err as Error);
                setUser(null);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        // Escuchar cambios de autenticación en tiempo real
        // Esto es crucial para mantener el estado actualizado sin recargar la página
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    setUser(session?.user || null);
                    // Si el usuario acaba de iniciar sesión, volvemos a cargar el perfil
                    if (session?.user) {
                        // Podrías llamar a una función para obtener solo el perfil aquí,
                        // o simplemente re-ejecutar fetchUserData si es más simple.
                        // Para evitar llamadas extras al initial_session, puedes refinar la lógica.
                        // Por simplicidad, aquí lo ejecutamos si el usuario está presente.
                        supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()
                            .then(({ data, error }) => {
                                if (error && error.code !== 'PGRST116') {
                                    console.error("Error fetching profile on auth change:", error);
                                    setUserProfile(null);
                                } else if (data) {
                                    setUserProfile(data as IUserProfile);
                                } else {
                                    setUserProfile(null);
                                }
                            });
                    }
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserProfile(null);
                }
                // Si quieres reaccionar a otros eventos (USER_UPDATED, PASSWORD_RECOVERY), añádelos aquí
            }
        );

        // Limpieza del listener
        return () => {
            if (authListener) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []); // Dependencia vacía para que se ejecute solo una vez al montar

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                setError(signOutError);
            } else {
                setUser(null);
                setUserProfile(null);
            }
        } catch (err) {
            console.error("Error during logout:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userProfile, // Renombrado de userData a userProfile para claridad
        loading,
        error,
        logout
    };
};