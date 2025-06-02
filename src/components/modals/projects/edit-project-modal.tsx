"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface Project {
  id: string
  name: string
  description?: string
  type?: string
}

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateProject: (id: string, project: { name: string; description: string; type: string }) => void
  project: Project | null
}

export function EditProjectModal({ isOpen, onClose, onUpdateProject, project }: EditProjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("generic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string }>({})

  // Cargar los datos del proyecto cuando cambia
  useEffect(() => {
    if (project) {
      setName(project.name || "")
      setDescription(project.description || "")
      setType(project.type || "generic")
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!project) return

    // Validación
    const newErrors: { name?: string } = {}
    if (!name.trim()) {
      newErrors.name = "El nombre del proyecto es obligatorio"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onUpdateProject(project.id, {
        name,
        description,
        type,
      })

      setErrors({})
      onClose()
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar proyecto</DialogTitle>
          <DialogDescription>
            Modifica la información del proyecto. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="flex items-center">
              Nombre del proyecto <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa el nombre del proyecto"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el propósito del proyecto"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-type">Tipo de proyecto</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generic">Genérico</SelectItem>
                <SelectItem value="software">Desarrollo de Software</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="design">Diseño</SelectItem>
                <SelectItem value="research">Investigación</SelectItem>
                <SelectItem value="business">Negocio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
