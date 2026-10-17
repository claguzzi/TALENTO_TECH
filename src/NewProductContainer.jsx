import { useState } from 'react'
import ProductForm from './ProductForm'

function NewProductContainer({ onCreateProduct }) {
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFormSubmit(producto) {
    setLoading(true)
    setError(null)
    setMensaje('')

    try {
      await onCreateProduct(producto)
      setMensaje('Producto agregado al catálogo.')
      return true
    } catch (errorGuardado) {
      setError(errorGuardado.message || 'No se pudo agregar el producto. Intenta nuevamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="nuevo-producto" aria-labelledby="titulo-nuevo-producto">
      <h2 id="titulo-nuevo-producto">Agregar producto</h2>
      <p id="aviso-producto">Práctica con carga simulada. Los productos agregados se conservan hasta recargar la página.</p>
      <ProductForm loading={loading} onSubmit={handleFormSubmit} />
      <p role="status">{loading ? 'Guardando producto…' : mensaje}</p>
      {error && <p className="error-equipo" role="alert">{error}</p>}
    </section>
  )
}

export default NewProductContainer
