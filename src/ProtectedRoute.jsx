import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

function ProtectedRoute({ children }) {
  const { usuario, cargando, errorAuth } = useAuth()
  const location = useLocation()
  if (cargando) return <p role="status">Comprobando sesión...</p>
  if (errorAuth) return <p className="error-equipo" role="alert">{errorAuth}</p>
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  return children
}
export default ProtectedRoute
