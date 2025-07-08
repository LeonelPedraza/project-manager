import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/supabase/supabase';
import { useEffect } from 'react';

const USER_QUERY_KEY = 'currentUser';

export const useUser = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            if (!session) return { user: null, profile: null };

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError) throw profileError;

            return { user: session.user, profile: profileData };
        },
        staleTime: Infinity, // Los datos del usuario son estáticos hasta que cambie la sesión
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true, // Podría ser true o false dependiendo de la estrategia
    });

    // Suscribirse a cambios de autenticación para invalidar la caché
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [queryClient]);

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            // Aquí podrías manejar el error de forma más visible para el usuario
        } else {
            queryClient.setQueryData([USER_QUERY_KEY], { user: null, profile: null }); // Actualización optimista
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] }); // Asegurar revalidación
        }
    };

    return {
        user: data?.user || null,
        profile: data?.profile || null,
        isLoading,
        error: error ? error.message : null,
        logout,
    };
};
