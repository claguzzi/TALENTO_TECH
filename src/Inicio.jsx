import { Link } from 'react-router-dom'
import Asistente from './Asistente'
import NewProductContainer from './NewProductContainer'

function Inicio({ productos, listado, asistentes, crearProducto, puedeCrear }) {
  return (
    <>
      <section className="hero-inicio">
        <div>
          <span className="insignia">Ideas, herramientas y comunidad</span>
          <h1>Tu próximo proyecto empieza aquí.</h1>
          <p>Encuentra herramientas para crear, aprender y dar vida a tus ideas junto a nuestra comunidad.</p>
          <a className="accion-principal" href="#titulo-productos">Explorar productos ↓</a>
        </div>
        {productos.length > 0 && <Link className="hero-producto" to={`/productos/${productos[0].id}`}>
          <img src={productos[0].imagen} alt={productos[0].nombre} width="400" height="260" />
          <span>Descubre {productos[0].nombre.toLowerCase()} →</span>
        </Link>}
      </section>
      <section className="seccion-productos" aria-labelledby="titulo-productos">
        <h2 id="titulo-productos">Productos destacados</h2>
        <p className="introduccion-seccion">Una selección para acompañarte en cada etapa de tu proyecto.</p>
        {listado}
      </section>
      <section className="seccion-participantes" aria-labelledby="titulo-asistentes">
        <h2 id="titulo-asistentes">Participantes del evento</h2>
        <div className="lista-asistentes">
          {asistentes.map((asistente) => <Asistente key={asistente.id} {...asistente} />)}
        </div>
      </section>
      {puedeCrear && <NewProductContainer onCreateProduct={crearProducto} />}
    </>
  )
}

export default Inicio

