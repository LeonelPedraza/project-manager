// app/actions/user.ts
"use server"; // ¡Importante! Marca este archivo como Server Actions

import { userRegistrationSchema, UserRegistrationFormInput } from '@/lib/schemas';
import { ZodError } from 'zod';
import { revalidatePath } from 'next/cache'; // Para revalidar datos si es necesario

// Puedes definir un tipo para la respuesta de la acción
type ActionResponse = {
    success: boolean;
    message?: string;
    errors?: ZodError['flatten']['fieldErrors'];
    user?: UserRegistrationFormInput; // O solo los datos que quieras devolver
};

export async function registerUser(
    prevState: ActionResponse | undefined, // Estado anterior de la acción (para useFormState)
    formData: FormData
): Promise<ActionResponse> {
    // 1. Extraer datos del FormData
    const data = Object.fromEntries(formData.entries());

    // 2. Validar los datos con el esquema Zod
    const parsedData = userRegistrationSchema.safeParse(data);

    if (!parsedData.success) {
        // Si la validación falla en el servidor, devuelve los errores.
        console.error("Server-side validation failed:", parsedData.error.flatten().fieldErrors);
        return {
            success: false,
            message: "Error de validación. Por favor, revisa los campos.",
            errors: parsedData.error.flatten().fieldErrors,
        };
    }

    // 3. Si la validación es exitosa, procesa los datos
    const { username, email, password } = parsedData.data;

    try {
        // Aquí iría tu lógica de negocio:
        // - Hash de la contraseña
        // - Guardar el usuario en la base de datos
        // - Enviar email de confirmación, etc.

        console.log(`Usuario registrado en el servidor: ${username}, ${email}`);

        // Ejemplo: Simular un error de base de datos
        // if (username === "admin") {
        //   throw new Error("El usuario 'admin' no está permitido.");
        // }

        // Opcional: Revalidar la caché si se modifican datos que afectan otras partes de la UI
        // revalidatePath('/'); // O la ruta que necesites revalidar

        return {
            success: true,
            message: "¡Registro exitoso!",
            user: { username, email, password: "" }, // No devuelvas la contraseña
        };

    } catch (error: any) {
        console.error("Error al registrar usuario:", error.message);
        return {
            success: false,
            message: `Error interno del servidor: ${error.message}`,
        };
    }
}