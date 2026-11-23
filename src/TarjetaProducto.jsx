import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './TarjetaProducto.module.css'

function TarjetaProducto({ id, imagen, nombre, precio, descripcion, categoria, stock, onEditar }) {
  const [esFavorito, setEsFavorito] = useState(false)

  function marcarComoFavorito() {
    setEsFavorito((valorActual) => !valorActual)
  }

  return (
    <article className={styles.tarjeta}>
      <Link className={styles.enlaceImagen} to={`/productos/${id}`} aria-label={`Ver detalles de ${nombre}`}>
      <img
        className={styles.imagen}
        src={imagen}
        alt={nombre}
        width="400"
        height="260"
        loading="lazy"
      />
      </Link>
      <div className={styles.contenido}>
        {categoria && <span className={styles.categoria}>{categoria}</span>}
        <h3 className={styles.nombre}><Link to={`/productos/${id}`}>{nombre}</Link></h3>
        {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
        <p className={styles.precio}>{typeof precio === 'number' ? `USD ${precio.toFixed(2)}` : precio}</p>
        {Number.isInteger(stock) && <p className={styles.stock}>{stock > 0 ? `${stock} disponibles` : "Sin stock"}</p>}
      </div>
      <button type="button" className={styles.editar} onClick={onEditar} disabled={!onEditar} aria-label={`Editar ${nombre}`}>Editar</button>
      <button
        type="button"
        className={styles.favorito}
        onClick={marcarComoFavorito}
        aria-pressed={esFavorito}
        aria-label={`Favorito: ${nombre}`}
      >
        <span aria-hidden="true">{esFavorito ? '♥' : '♡'}</span>
        {esFavorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
      </button>
    </article>
  )
}

export default TarjetaProducto

