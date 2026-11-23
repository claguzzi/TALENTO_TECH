import TarjetaProducto from './TarjetaProducto'

function Item({ producto, onEditar }) {
  return <TarjetaProducto {...producto} onEditar={onEditar} />
}

export default Item
