import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Inicio from './Inicio'
import DetalleProducto from './DetalleProducto'
import Item from './Item'

function ItemListContainer({ asistentes }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/productos.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('No se pudieron cargar los productos. Recarga la página para intentarlo nuevamente.')
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('El archivo de productos no contiene una lista válida.')
        if (!controller.signal.aborted) setProducts(data)
      })
      .catch((loadError) => {
        if (!controller.signal.aborted) setError(loadError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  async function crearProducto(producto) {
    // La creación sigue siendo una simulación local, sin modificar el JSON.
    await new Promise((resolve) => setTimeout(resolve, 700))
    if (!producto.nombre || !Number.isFinite(producto.precio) || producto.precio <= 0) {
      throw new Error('Ingresa un nombre y un precio mayor que cero.')
    }
    const nuevoProducto = {
      ...producto,
      id: crypto.randomUUID(),
      precio: `USD ${producto.precio.toFixed(2)}`,
    }
    setProducts((actuales) => [...actuales, nuevoProducto])
  }

  const listado = loading ? (
    <p role="status">Cargando productos...</p>
  ) : error ? (
    <p className="error-equipo" role="alert">{error}</p>
  ) : products.length === 0 ? (
    <p>No hay productos disponibles.</p>
  ) : (
    <div className="catalogo">
      {products.map((producto) => <Item key={producto.id} producto={producto} />)}
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={
        <Inicio
          productos={products}
          listado={listado}
          asistentes={asistentes}
          crearProducto={crearProducto}
          puedeCrear={!loading && !error}
        />
      } />
      <Route path="/productos/:id" element={
        loading ? <p role="status">Cargando producto...</p> :
        error ? <p className="error-equipo" role="alert">{error}</p> :
        <DetalleProducto productos={products} />
      } />
      <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
    </Routes>
  )
}

export default ItemListContainer
