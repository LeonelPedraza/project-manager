"use client"

import { useState, useEffect } from "react"

// Breakpoints comunes (en píxeles)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useMobile() {
  // Estado para almacenar si estamos en un dispositivo móvil
  const [isMobile, setIsMobile] = useState<boolean>(false)
  // Estado para almacenar si estamos en una tablet
  const [isTablet, setIsTablet] = useState(false)
  // Estado para almacenar el ancho actual de la ventana
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    // Función para actualizar los estados basados en el ancho de la ventana
    const updateSize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < breakpoints.md)
      setIsTablet(width >= breakpoints.md && width < breakpoints.lg)
    }

    // Establecer los valores iniciales
    updateSize()

    // Añadir event listener para actualizar cuando cambie el tamaño de la ventana
    window.addEventListener("resize", updateSize)

    // Limpiar el event listener cuando el componente se desmonte
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    windowWidth,
    breakpoints,
  }
}
