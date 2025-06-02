// lib/schemas.ts
import { z } from 'zod';
import { ProjectType } from '../enums/project-type';

export const projectSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    description: z.string().nullable(),
    project_type: z.enum(Object.values(ProjectType) as [string, ...string[]])
})

// Inferir el tipo para usarlo en TypeScript
export type ProjectForm = z.infer<typeof projectSchema>;