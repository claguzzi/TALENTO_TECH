function ProductForm({ loading, onSubmit }) {
  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    const formulario = event.currentTarget
    const datos = new FormData(formulario)
    const guardado = await onSubmit({
      nombre: datos.get('nombre').trim(),
      precio: Number(datos.get('precio')),
      descripcion: datos.get('descripcion').trim(),
      imagen: datos.get('imagen'),
    })
    if (guardado) formulario.reset()
  }

  return (
    <form className="producto-form" onSubmit={handleSubmit} aria-busy={loading} aria-describedby="aviso-producto">
      <fieldset disabled={loading}>
        <legend>Datos del producto</legend>
        <label htmlFor="producto-nombre">Nombre</label>
        <input id="producto-nombre" name="nombre" required maxLength={100} />

        <label htmlFor="producto-precio">Precio en USD</label>
        <input id="producto-precio" name="precio" type="number" min="0.01" step="0.01" required />

        <label htmlFor="producto-descripcion">Descripción (opcional)</label>
        <textarea id="producto-descripcion" name="descripcion" rows={3} maxLength={500} />

        <label htmlFor="producto-imagen">Imagen de ejemplo</label>
        <select id="producto-imagen" name="imagen" defaultValue="/productos/cuaderno.svg">
          <option value="/productos/cuaderno.svg">Cuaderno</option>
          <option value="/productos/teclado.svg">Teclado</option>
          <option value="/productos/auriculares.svg">Auriculares</option>
        </select>
      </fieldset>
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando…' : 'Agregar producto'}
      </button>
    </form>
  )
}

export default ProductForm
