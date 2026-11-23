import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PieDePosteo from './PieDePosteo'
import { useAuth } from './AuthContext'

function Layout({ children, pie }) {
  const { pathname, hash } = useLocation()
  const { usuario } = useAuth()

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
              <li><Link to="/admin/cupones" aria-current={pathname === '/admin/cupones' ? 'page' : undefined}>Cupones</Link></li>
              <li><Link to={usuario ? "/perfil" : "/login"}>{usuario ? "Mi perfil" : "Ingresar"}</Link></li>
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
