import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PieDePosteo from './PieDePosteo'

function Layout({ children, pie }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="posteo">
      <header className="encabezado" id="inicio">
        <div className="barra-superior">
          <Link className="marca" to="/">Talento Tech<span>Comunidad creativa</span></Link>
          <nav aria-label="Navegación principal">
            <ul className="navegacion">
              <li><Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>Inicio</Link></li>
              <li><Link to="/#titulo-asistentes">Participantes</Link></li>
              <li><Link to="/#titulo-productos">Productos</Link></li>
              <li><a href="#titulo-equipo">Equipo</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="cuerpo-posteo">{children}</main>
      <PieDePosteo>{pie}</PieDePosteo>
    </div>
  )
}

export default Layout
