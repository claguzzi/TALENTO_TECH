import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './TarjetaProducto.module.css'

function TarjetaProducto({ id, imagen, nombre, precio, descripcion }) {
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
        <h3 className={styles.nombre}><Link to={`/productos/${id}`}>{nombre}</Link></h3>
        {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
        <p className={styles.precio}>{precio}</p>
      </div>
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

