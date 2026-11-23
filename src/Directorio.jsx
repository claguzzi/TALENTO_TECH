import { useEffect, useState } from 'react'
import TarjetaContacto from './TarjetaContacto'

function Directorio() {
  const [equipo, setEquipo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID

    async function cargarEquipo() {
      try {
        if (!projectId) throw new Error('Falta configurar el proyecto de Firebase para mostrar el equipo.')
        const integrantes = []
        let pageToken = ''
        do {
          const url = new URL(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/equipo`)
          url.searchParams.set('pageSize', '100')
          if (pageToken) url.searchParams.set('pageToken', pageToken)
          const respuesta = await fetch(url, { signal: controller.signal })
          if (!respuesta.ok) throw new Error('No se pudo cargar el equipo de Firestore. Verifica la configuración y los permisos de lectura.')
          const datos = await respuesta.json()
          for (const documento of datos.documents || []) {
            const campos = documento.fields || {}
            integrantes.push({
              id: documento.name,
              nombre: campos.nombre?.stringValue || '',
              rol: campos.rol?.stringValue || '',
              linkedinURL: campos.linkedinURL?.stringValue || '',
              fotoURL: campos.fotoURL?.stringValue || '',
            })
          }
          pageToken = datos.nextPageToken || ''
        } while (pageToken)
        if (!controller.signal.aborted) setEquipo(integrantes)
      } catch (errorCarga) {
        if (!controller.signal.aborted) setError(errorCarga.message || 'No se pudo cargar el equipo.')
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargarEquipo()
    return () => controller.abort()
  }, [])

  return (
    <section className="seccion-equipo" aria-labelledby="titulo-equipo" aria-busy={cargando}>
      <h2 id="titulo-equipo">Nuestro equipo</h2>
      {cargando ? <p role="status">Cargando equipo...</p> : error ? (
        <p className="error-equipo" role="alert">{error}</p>
      ) : equipo.length === 0 ? <p>No hay integrantes para mostrar.</p> : (
        <div className="equipo">
          {equipo.map((persona) => <TarjetaContacto key={persona.id} {...persona} />)}
        </div>
      )}
    </section>
  )
}

export default Directorio
