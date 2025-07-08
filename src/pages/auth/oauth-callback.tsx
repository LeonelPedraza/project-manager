import { LoadingAccount } from "@/components/ui/loading-account";
import { supabase } from "@/supabase/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router";


export default function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase maneja automáticamente la sesión y el almacenamiento del token
        // en localStorage/sessionStorage cuando la URL contiene el hash/fragmento
        // de la respuesta OAuth.
        // Aquí solo necesitamos asegurarnos de que la sesión se establezca
        // y redirigir al usuario a la página de inicio o dashboard.

        const handleAuthChange = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Redirige a tu página principal o dashboard después del login exitoso
                navigate('/dashboard', { replace: true });
            } else {
                // Puedes redirigir a la página de login o mostrar un mensaje de error
                navigate('/', { replace: true });
            }
        };

        // Escuchar cambios en el estado de autenticación de Supabase
        // Esto es útil por si el usuario ya está logueado o si la sesión expira
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/dashboard', { replace: true });
            } else if (event === 'SIGNED_OUT') {
                navigate('/login', { replace: true });
            } else if (event === 'INITIAL_SESSION' && !session) {
                // Esto ocurre al cargar la página por primera vez y no hay sesión activa
                console.log('Auth change: INITIAL_SESSION, no active session.');
                // Si llegamos aquí por una redirección y no hay sesión, algo fue mal
                // O si el usuario simplemente navega directamente a /auth/callback sin una sesión
                // Puedes optar por no hacer nada o redirigir
            }
        });

        // También intenta verificar la sesión al montar el componente por si se perdió el evento
        // o para asegurar que se redirige rápidamente
        handleAuthChange();

        // Limpia la suscripción al desmontar el componente
        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <LoadingAccount />
    );
}