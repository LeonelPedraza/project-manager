import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';  
// import { Resend } from "https://deno.land/x/resend@v1.1.0/mod.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_DB_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// const BASE_URL = Deno.env.get('BASE_URL');

// const resend = new Resend(RESEND_API_KEY);

const supabase = createClient(
    SUPABASE_URL ?? '',
    SUPABASE_SERVICE_ROLE_KEY ?? ''
);

console.info('server started');
// 4. Servidor HTTP para manejar las solicitudes entrantes
Deno.serve(async (req) => {
    // Solo acepta solicitudes POST
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 405,
        });
    }

    try {
        // 5. Parsear el cuerpo de la solicitud JSON
        const {
            invited_email,
            project_id,
            role_id,
            invited_by_user_id
        } = await req.json();

        // 6. Validaciones básicas de los datos recibidos
        if (!invited_email || !project_id || !role_id || !invited_by_user_id) {
            return new Response(JSON.stringify({ error: 'Missing required fields: invited_email, project_id, invited_by_user_id, project_name' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        // 7. Generar un token único para la invitación
        const token = crypto.randomUUID(); // Usa crypto.randomUUID() para generar un UUID v4 seguro.

        // 8. Establecer la fecha de expiración de la invitación (ej. 48 horas desde ahora)
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // 9. Insertar el registro de la invitación en la base de datos (estado 'pending')
        const { data: invitation, error: invitationError } = await supabase
            .from('invitations') // Asegúrate de que tu tabla se llame 'invitations'
            .insert([{
                project_id: project_id,
                invited_email: invited_email,
                role_id: role_id,
                invited_by_user_id: invited_by_user_id,
                token: token,
                expires_at: expiresAt,
                status: 'PENDING' // Siempre inicia como pendiente
            }])
            .select(`
                projects (name)
            `) // Para obtener los datos del registro insertado, incluyendo el ID
            .single(); // Espera un único resultado

        if (invitationError) {
            console.error('Supabase Error creating invitation:', invitationError.message);
            return new Response(JSON.stringify({ error: 'Failed to create invitation record in database', details: invitationError.message }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        // 10. Construir el enlace de invitación
        // ¡IMPORTANTE! Para desarrollo local, usa `http://localhost:3000` (o el puerto de tu app React).
        // Para producción, esto debe ser el dominio de tu aplicación (ej. `https://tudominio.com`).
        // Puedes pasar el `baseUrl` como una variable de entorno a la Edge Function para que sea dinámico.
    //     const invitationLink = `${BASE_URL}/invite?token=${token}`;

    //     // 11. Enviar el correo electrónico usando Resend
    //     const { data: emailData, error: emailError } = await resend.emails.send({
    //         from: 'Tu Equipo <onboarding@yourdomain.com>', // Reemplaza 'yourdomain.com' con un dominio VERIFICADO en Resend
    //         to: [invited_email],
    //         subject: `¡Has sido invitado al proyecto "${project_name}"!`,
    //         html: `
    //     <p>Hola,</p>
    //     <p>Has sido invitado a unirte al proyecto <strong>"${project_name}"</strong>.</p>
    //     <p>Haz clic en el siguiente enlace para aceptar la invitación:</p>
    //     <p><a href="${invitationLink}">${invitationLink}</a></p>
    //     <p>Este enlace expirará en 48 horas. Si ya tienes una cuenta, inicia sesión después de hacer clic en el enlace. Si no la tienes, se te pedirá que crees una.</p>
    //     <p>¡Te esperamos!</p>
    //     <p>El equipo de tu aplicación</p>
    //   `,
    //     });

    //     if (emailError) {
    //         console.error('Resend Error sending email:', emailError.message);
    //         // Decide qué hacer si el correo no se envía:
    //         // ¿Borrar la invitación? ¿Marcarla como 'email_failed'?
    //         // Por ahora, solo registramos el error, pero la invitación en DB ya existe.
    //         return new Response(JSON.stringify({
    //             message: 'Invitation record created, but failed to send email.',
    //             emailError: emailError.message,
    //             invitationId: invitation.id
    //         }), {
    //             headers: { 'Content-Type': 'application/json' },
    //             status: 202, // Aceptado pero con advertencia
    //         });
    //     }

        // 12. Respuesta exitosa
        return new Response(JSON.stringify({ message: 'Invitation sent successfully!', invitationId: invitation.id }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        // 13. Manejo de errores generales
        console.error('Caught general error in Edge Function:', error);
        return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});