import { useEffect, useState } from 'react'

function ProductForm({ loading, onSubmit, productoAEditar, cancelarEdicion, puedeGuardar }) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [stock, setStock] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState('')

  useEffect(() => {
    setNombre(productoAEditar?.nombre ?? '')
    setPrecio(productoAEditar?.precio ?? '')
    setCategoria(productoAEditar?.categoria ?? '')
    setStock(productoAEditar?.stock ?? '')
    setDescripcion(productoAEditar?.descripcion ?? '')
    setImagen(productoAEditar?.imagen ?? '')
  }, [productoAEditar])

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading || !puedeGuardar) return
    const valorPrecio = Number(precio)
    if (!nombre.trim() || precio === '' || !Number.isFinite(valorPrecio) || valorPrecio <= 0) {
      window.alert('Ingresa un nombre y un precio numérico mayor que cero.')
      return
    }
    if (!categoria.trim() || stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0 || !imagen.trim()) {
      window.alert('Ingresa una categoría, un stock válido y una imagen.')
      return
    }
    const guardado = await onSubmit({ nombre: nombre.trim(), precio: valorPrecio, categoria: categoria.trim(), stock: Number(stock), descripcion: descripcion.trim(), imagen: imagen.trim() })
    if (guardado && !productoAEditar) { setNombre(''); setPrecio(''); setCategoria(''); setStock(''); setDescripcion(''); setImagen('') }
  }

  return (
    <form className="producto-form" onSubmit={handleSubmit} noValidate aria-busy={loading} aria-describedby="aviso-producto">
      <fieldset disabled={loading || !puedeGuardar}>
        <legend>Datos del producto</legend>
        <label htmlFor="producto-nombre">Nombre</label>
        <input id="producto-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} />
        <label htmlFor="producto-categoria">Categoría</label>
        <input id="producto-categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} maxLength={50} />
        <label htmlFor="producto-stock">Stock</label>
        <input id="producto-stock" type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
        <label htmlFor="producto-precio">Precio en USD</label>
        <input id="producto-precio" type="number" min="0" step="any" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        <label htmlFor="producto-descripcion">Descripción (opcional)</label>
        <textarea id="producto-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} maxLength={500} />
        <label htmlFor="producto-imagen">URL o ruta de la imagen</label>
        <input id="producto-imagen" value={imagen} onChange={(e) => setImagen(e.target.value)} />
      </fieldset>
      <button type="submit" disabled={loading || !puedeGuardar}>{loading ? 'Guardando…' : productoAEditar ? 'Actualizar producto' : 'Agregar producto'}</button>
      {productoAEditar && <button type="button" className="cancelar-edicion" disabled={loading} onClick={cancelarEdicion}>Cancelar edición</button>}
    </form>
  )
}

export default ProductForm
