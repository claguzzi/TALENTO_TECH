import { Link } from 'react-router-dom'
import Asistente from './Asistente'
import NewProductContainer from './NewProductContainer'

function Inicio({ productos, listado, busqueda, setBusqueda, cantidadResultados, asistentes, guardarProducto, productoAEditar, cancelarEdicion, puedeGuardar }) {
  return (
    <>
      <title>Catálogo de productos | Talento Tech</title>
      <meta name="description" content="Descubre productos y herramientas para crear, aprender y desarrollar tus proyectos." />
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
        <div className="buscador-productos">
          <label htmlFor="buscar-productos">Buscar productos</label>
          <div className="buscador-campo">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>
            <input id="buscar-productos" type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por nombre" />
          </div>
          {busqueda.trim() && <p className="resultados-busqueda" role="status">{cantidadResultados} {cantidadResultados === 1 ? 'producto encontrado' : 'productos encontrados'}</p>}
        </div>
        {listado}
      </section>
      <section className="seccion-participantes" aria-labelledby="titulo-asistentes">
        <h2 id="titulo-asistentes">Participantes del evento</h2>
        <div className="lista-asistentes">
          {asistentes.map((asistente) => <Asistente key={asistente.id} {...asistente} />)}
        </div>
      </section>
      <NewProductContainer onGuardar={guardarProducto} productoAEditar={productoAEditar} cancelarEdicion={cancelarEdicion} puedeGuardar={puedeGuardar} />
    </>
  )
}

export default Inicio

