"use server"

import { projectSchema } from "@/lib/schemas/project";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ActionResponse = {
    success: boolean;
    message?: string;
    errors?: z.inferFlattenedErrors<typeof projectSchema>['fieldErrors']
};

export async function getProjects() {}

export async function createProject(state: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
    const req = Object.fromEntries(formData.entries());
    const parsedData = projectSchema.safeParse(req);

    if (!parsedData.success) {
        return {
        success: false,
        message: "Error de validación. Por favor, revisa los campos.",
        errors: parsedData.error.flatten().fieldErrors,
        };
    }
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('projects').insert(parsedData.data);
    if (error) {
        return {
            success: false,
            message: "Error al crear el proyecto. Por favor, inténtalo de nuevo."
        };
    }
    return {
        success: true,
        message: `Project "${parsedData.data.name}" created successfully`,
      };
}

export async function updateProject(formData: FormData) {}

export async function deleteProject(formData: FormData) {}