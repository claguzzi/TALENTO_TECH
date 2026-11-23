import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Login() {
  const { usuario, cargando, errorAuth, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  async function ingresar(evento) {
    evento.preventDefault()
    setOcupado(true); setError('')
    try {
      await login(email.trim(), password)
      navigate(location.state?.desde === '/perfil' ? '/perfil' : '/', { replace: true })
    } catch {
      setError('No se pudo iniciar sesión. Comprueba tus datos e intenta nuevamente.')
    } finally { setOcupado(false) }
  }

  if (cargando) return <p role="status">Comprobando sesión...</p>
  if (usuario) return <Navigate to="/perfil" replace />
  return (
    <section className="perfil">
      <title>Iniciar sesi?n | Talento Tech</title>
      <meta name="robots" content="noindex" />
      <h1>Iniciar sesión</h1>
      {errorAuth ? <p className="error-equipo" role="alert">{errorAuth}</p> : (
        <form className="producto-form" onSubmit={ingresar}>
          <fieldset disabled={ocupado}>
            <label htmlFor="login-email">Correo electrónico</label>
            <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="login-password">Contraseña</label>
            <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </fieldset>
          <button disabled={ocupado} type="submit">{ocupado ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
      )}
      {error && <p className="error-equipo" role="alert">{error}</p>}
    </section>
  )
}
export default Login
