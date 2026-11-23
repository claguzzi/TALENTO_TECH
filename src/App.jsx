import ItemListContainer from './ItemListContainer'
import Layout from './Layout'
import Directorio from './Directorio'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Perfil from './Perfil'
import Login from './Login'
import './App.css'

function App() {
  const asistentes = [
    { id: 1, nombre: 'Juan Pérez', tarea: 'Frontend Developer', emoji: '👨‍💻' },
    { id: 2, nombre: 'Ana Gómez', tarea: 'Diseñadora UX/UI', emoji: '🎨' },
    { id: 3, nombre: 'Carlos Ruiz', tarea: 'Backend Developer', emoji: '👨‍💻' },
  ]

  return (
    <AuthProvider>
      <Layout pie={<Directorio />}>
        <Routes>
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ItemListContainer asistentes={asistentes} />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
