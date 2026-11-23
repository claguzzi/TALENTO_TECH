import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorAuth, setErrorAuth] = useState('')
  const [conexion, setConexion] = useState(null)

  useEffect(() => {
    let activo = true
    let cancelar = () => {}
    async function iniciar() {
      try {
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
        const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
        if (!projectId || !apiKey) throw new Error('Configura Firebase para habilitar el inicio de sesión.')
        const version = '10.14.1'
        const appUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-app.js`
        const authUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`
        const [appSdk, authSdk] = await Promise.all([import(/* @vite-ignore */ appUrl), import(/* @vite-ignore */ authUrl)])
        if (!activo) return
        const nombre = 'autenticacion'
        const app = appSdk.getApps().find((item) => item.name === nombre) || appSdk.initializeApp({ projectId, apiKey }, nombre)
        const auth = authSdk.getAuth(app)
        setConexion({ auth, authSdk })
        cancelar = authSdk.onAuthStateChanged(auth, (actual) => {
          if (activo) { setUsuario(actual); setCargando(false) }
        }, () => {
          if (activo) { setErrorAuth('No se pudo comprobar la sesión.'); setCargando(false) }
        })
      } catch (error) {
        if (activo) { setErrorAuth(error.message || 'No se pudo conectar con Firebase Authentication.'); setCargando(false) }
      }
    }
    iniciar()
    return () => { activo = false; cancelar() }
  }, [])

  async function login(email, password) {
    if (!conexion) throw new Error('Firebase Authentication no está disponible.')
    return conexion.authSdk.signInWithEmailAndPassword(conexion.auth, email, password)
  }

  async function logout() {
    if (!conexion) throw new Error('Firebase Authentication no está disponible.')
    await conexion.authSdk.signOut(conexion.auth)
  }

  return <AuthContext.Provider value={{ usuario, cargando, errorAuth, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
