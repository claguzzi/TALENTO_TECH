import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Perfil() {
  const { usuario, logout } = useAuth()
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const navigate = useNavigate()

  async function cerrarSesion() {
    setOcupado(true); setError('')
    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      setError('No se pudo cerrar la sesión. Intenta nuevamente.')
      setOcupado(false)
    }
  }

  return (
    <section className="perfil">
      <title>Mi perfil | Talento Tech</title>
      <meta name="robots" content="noindex" />
      <h1>Mi perfil</h1>
      <p>¡Hola de nuevo, {usuario.email}!</p>
      <button className="boton-sesion" type="button" onClick={cerrarSesion} disabled={ocupado}>{ocupado ? 'Cerrando sesión…' : 'Cerrar sesión'}</button>
      {error && <p className="error-equipo" role="alert">{error}</p>}
    </section>
  )
}
export default Perfil
