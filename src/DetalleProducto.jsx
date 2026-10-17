import { Link, useParams } from 'react-router-dom'

function DetalleProducto({ productos }) {
  const { id } = useParams()
  const producto = productos.find((item) => String(item.id) === id)

  if (!producto) {
    return (
      <section>
        <h1>Producto no encontrado</h1>
        <p>El producto no existe o ya no está disponible en esta sesión.</p>
        <Link className="accion-principal" to="/">Volver al inicio</Link>
      </section>
    )
  }

  return (
    <>
      <Link className="volver-catalogo" to="/#titulo-productos">← Volver a productos destacados</Link>
      <article className="detalle-producto">
        <img src={producto.imagen} alt={producto.nombre} width="400" height="260" />
        <div>
          <span className="insignia">Catálogo · Talento Tech</span>
          <h1>{producto.nombre}</h1>
          <p className="precio-detalle">{producto.precio}</p>
          <h2>Acerca del producto</h2>
          <p>{producto.descripcion || 'Este producto no tiene una descripción adicional.'}</p>
          <dl className="datos-producto">
            <div><dt>Referencia</dt><dd>{producto.id}</dd></div>
            <div><dt>Moneda</dt><dd>Dólares estadounidenses (USD)</dd></div>
          </dl>
        </div>
      </article>
    </>
  )
}

export default DetalleProducto
