import { useState } from 'react'
import ProductForm from './ProductForm'

function NewProductContainer({ onGuardar, productoAEditar, cancelarEdicion, puedeGuardar }) {
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFormSubmit(producto) {
    setLoading(true); setError(null); setMensaje('')
    try {
      await onGuardar(producto)
      setMensaje(productoAEditar ? 'Producto actualizado.' : 'Producto agregado al catálogo.')
      return true
    } catch {
      setError('No se pudo guardar el producto. Verifica la conexión y los permisos de Firestore.')
      return false
    } finally { setLoading(false) }
  }

  return (
    <section className="nuevo-producto" aria-labelledby="titulo-nuevo-producto">
      <h2 id="titulo-nuevo-producto">{productoAEditar ? 'Editar producto' : 'Agregar producto'}</h2>
      <p id="aviso-producto">{puedeGuardar ? 'Los cambios se guardan en Firestore.' : 'Inicia sesi?n para crear o editar productos y verifica la configuraci?n de Firebase.'}</p>
      <ProductForm loading={loading} onSubmit={handleFormSubmit} productoAEditar={productoAEditar} cancelarEdicion={cancelarEdicion} puedeGuardar={puedeGuardar} />
      <p role="status">{loading ? 'Guardando producto…' : mensaje}</p>
      {error && <p className="error-equipo" role="alert">{error}</p>}
    </section>
  )
}
export default NewProductContainer
