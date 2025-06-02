import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Loader2 } from "lucide-react"

import { createProject } from "@/actions/projects"
import { ProjectForm, projectSchema } from "@/lib/schemas/project"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectType } from "@/lib/enums/project-type"
import { useActionState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {

  const [state, formAction] = useActionState(createProject, null);
  const { toast } = useToast()

  const {
    register,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_type: ProjectType.GENERIC,
    }
  });

  const closeModal = () => {
    onClose();
    reset();
  }

  useEffect(() => {
    if (state) {
      if (state.success) {
        closeModal();
        toast({
          title: "Proyecto creado",
          description: state.message,
        })
      } else {
        // Inyectar errores del servidor en React Hook Form
        if (state.errors) {
          Object.keys(state.errors).forEach((key) => {
            const field = key as keyof ProjectForm;
            setError(field, {
              type: "server",
              message: state.errors![field]![0], // Toma el primer mensaje de error para el campo
            });
          });
        }
        // Mostrar mensaje general de error si existe
        if (state.message && !state.errors) {
          toast({
            title: "Error al crear el proyecto",
            description: state.message,
          })
        }
      }
    }
  }, [state, setError, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo proyecto. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="flex items-center">
              Nombre del proyecto <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="project-name"
              placeholder="Ingresa el nombre del proyecto"
              className={errors.name ? "border-red-500" : ""}
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea
              id="project-description"
              placeholder="Describe brevemente el propósito del proyecto"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-type">Tipo de proyecto</Label>
            <Select {...register('project_type')} defaultValue={ProjectType.GENERIC}>
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.values(ProjectType).map((type) => (
                    <SelectItem value={type} key={type}>{type}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            {errors.project_type && <p className="text-red-500 text-sm">{errors.project_type.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="disabled:opacity-50" onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Crear proyecto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
