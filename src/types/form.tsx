// components/UserForm.tsx
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrationSchema, UserRegistrationFormInput } from '@/lib/schemas';
import { useFormState, useFormStatus } from 'react-dom'; // Para integrar con Server Actions
import { registerUser } from '@/app/actions/user'; // Importa tu Server Action

function SubmitButton() {
    const { pending } = useFormStatus(); // Hook para saber si la acción está en curso
    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Registrando...' : 'Registrar'}
        </button>
    );
}

export function UserForm() {
    // Inicializa useFormState con la Server Action y un estado inicial
    const [state, formAction] = useFormState(registerUser, undefined);

    const {
        register,
        handleSubmit,
        setError, // Usaremos setError para inyectar errores del servidor
        formState: { errors, isSubmitting },
        reset, // Para resetear el formulario después de un envío exitoso
    } = useForm<UserRegistrationFormInput>({
        resolver: zodResolver(userRegistrationSchema), // Integración Zod
        // Puedes establecer valores por defecto aquí si los necesitas
    });

    // Efecto para manejar la respuesta de la Server Action
    useEffect(() => {
        if (state) {
            if (state.success) {
                alert(state.message); // O muestra un toast/notificación
                reset(); // Limpia el formulario
                // Opcional: Redirigir o hacer algo más
            } else {
                // Inyectar errores del servidor en React Hook Form
                if (state.errors) {
                    Object.keys(state.errors).forEach((key) => {
                        const field = key as keyof UserRegistrationFormInput;
                        setError(field, {
                            type: "server",
                            message: state.errors![field]![0], // Toma el primer mensaje de error para el campo
                        });
                    });
                }
                // Mostrar mensaje general de error si existe
                if (state.message && !state.errors) {
                    alert(state.message); // O muestra un toast para errores no específicos de campo
                }
            }
        }
    }, [state, setError, reset]);

    // handleSubmit de React Hook Form se encarga de la validación client-side.
    // Cuando es exitosa, llama a formAction.
    const onSubmit = (data: UserRegistrationFormInput) => {
        // Cuando se usa formAction con useFormState, no necesitas pasar la data directamente.
        // React Hook Form envía la data a la acción.
        // La data ya está validada por Zod en el cliente aquí.
        // formData será generado automáticamente por el <form action={formAction}>
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} action={formAction}>
            {/* Mensaje global del servidor (si no es un error de campo específico) */}
            {state?.message && !state.success && !state.errors && (
                <p style={{ color: 'red' }}>{state.message}</p>
            )}

            <div>
                <label htmlFor="username">Nombre de Usuario:</label>
                <input
                    id="username"
                    {...register('username')}
                    aria-invalid={errors.username ? "true" : "false"}
                />
                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="password">Contraseña:</label>
                <input
                    id="password"
                    type="password"
                    {...register('password')}
                    aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
            </div>

            <SubmitButton />
        </form>
    );
}