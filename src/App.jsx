import { useEffect, useState } from 'react'
import ItemListContainer from './ItemListContainer'

import Layout from './Layout'
import Directorio from './Directorio'

import './App.css'

function App() {
  const [nosotros, setNosotros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function cargarEquipo() {
      try {
        const respuesta = await fetch('/data/nosotros.json', {
          signal: controller.signal,
        })
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el equipo. Intenta recargar la página.')
        }
        const datos = await respuesta.json()
        if (!Array.isArray(datos)) {
          throw new Error('El archivo del equipo no contiene una lista válida.')
        }
        if (!controller.signal.aborted) setNosotros(datos)
      } catch (errorCarga) {
        if (!controller.signal.aborted) {
          setError(errorCarga.message || 'No se pudo cargar el equipo.')
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargarEquipo()
    return () => controller.abort()
  }, [])

  const asistentes = [
    { id: 1, nombre: 'Juan Pérez', tarea: 'Frontend Developer', emoji: '👨‍💻' },
    { id: 2, nombre: 'Ana Gómez', tarea: 'Diseñadora UX/UI', emoji: '🎨' },
    { id: 3, nombre: 'Carlos Ruiz', tarea: 'Backend Developer', emoji: '👨‍💻' },
  ]

  return (
    <Layout pie={<Directorio usuarios={nosotros} cargando={cargando} error={error} />}>
      <ItemListContainer asistentes={asistentes} />
    </Layout>
  )
}

export default App






