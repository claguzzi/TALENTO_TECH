import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Inicio from './Inicio'
import DetalleProducto from './DetalleProducto'
import Item from './Item'
import GestionCupones from './GestionCupones'
import { paginar } from './paginacion'
import { useAuth } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'

async function conectarProductos() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  if (!projectId || !apiKey) return null
  const version = '10.14.1'
  const appUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-app.js`
  const firestoreUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`
  const [appSdk, firestore] = await Promise.all([import(/* @vite-ignore */ appUrl), import(/* @vite-ignore */ firestoreUrl)])
  const nombre = 'talentotech'
  const app = appSdk.getApps().find((item) => item.name === nombre) || appSdk.initializeApp({ projectId, apiKey, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN }, nombre)
  return { firestore, coleccion: firestore.collection(firestore.getFirestore(app), 'productos') }
}

function ItemListContainer({ asistentes }) {
  const { usuario } = useAuth()
  const [products, setProducts] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const productosFiltrados = useMemo(() => {
    const normalizar = (valor) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim()
    const termino = normalizar(busqueda)
    return termino ? products.filter((producto) => normalizar(String(producto.nombre || '')).includes(termino)) : products
  }, [products, busqueda])
  const { paginaActual, totalPaginas, items: productosPagina } = paginar(productosFiltrados, pagina, 6)
  function cambiarBusqueda(valor) { setBusqueda(valor); setPagina(1) }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [conexion, setConexion] = useState(null)
  const [productoAEditar, setProductoAEditar] = useState(null)

  useEffect(() => {
    let activo = true
    let cancelar = () => {}
    const controller = new AbortController()
    async function cargar() {
      try {
        const resultado = await conectarProductos()
        if (!activo) return
        if (!resultado) {
          const response = await fetch('/productos.json', { signal: controller.signal })
          if (!response.ok) throw new Error('No se pudieron cargar los productos de ejemplo.')
          const datos = await response.json()
          if (!Array.isArray(datos)) throw new Error('El catálogo de ejemplo no es válido.')
          if (activo) { setProducts(datos); setLoading(false) }
          return
        }
        setConexion(resultado)
        cancelar = resultado.firestore.onSnapshot(resultado.coleccion, (snapshot) => {
          if (!activo) return
          setProducts(snapshot.docs.map((documento) => ({ ...documento.data(), id: documento.id })))
          setLoading(false)
          setError(null)
        }, () => {
          if (activo) { setError('No se pudieron cargar los productos de Firestore. Verifica la conexión y los permisos.'); setLoading(false) }
        })
      } catch (fallo) {
        if (activo) { setError(fallo.message || 'No se pudo conectar con Firestore.'); setLoading(false) }
      }
    }
    cargar()
    return () => { activo = false; controller.abort(); cancelar() }
  }, [])

  async function guardarProducto(producto) {
    if (!conexion) throw new Error('Configura Firebase para guardar productos.')
    if (productoAEditar) {
      await conexion.firestore.updateDoc(conexion.firestore.doc(conexion.coleccion, productoAEditar.id), producto)
      setProductoAEditar(null)
    } else {
      await conexion.firestore.addDoc(conexion.coleccion, producto)
    }
  }

  function editarProducto(producto) {
    setProductoAEditar(producto)
    document.getElementById('titulo-nuevo-producto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const listado = loading ? <p role="status">Cargando productos...</p> : error ? (
    <p className="error-equipo" role="alert">{error}</p>
  ) : products.length === 0 ? <p>No hay productos disponibles.</p> : productosFiltrados.length === 0 ? <p role="status">No hay productos que coincidan con tu búsqueda.</p> : (
    <>
      <div className="catalogo">
        {productosPagina.map((producto) => <Item key={producto.id} producto={producto} onEditar={conexion && usuario ? () => editarProducto(producto) : undefined} />)}
      </div>
      {totalPaginas > 1 && <nav className="paginacion" aria-label="Páginas de productos">
        <button type="button" onClick={() => setPagina(paginaActual - 1)} disabled={paginaActual === 1} aria-label="Página anterior">← Anterior</button>
        <span aria-live="polite">Página {paginaActual} de {totalPaginas}</span>
        <button type="button" onClick={() => setPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} aria-label="Página siguiente">Siguiente →</button>
      </nav>}
    </>
  )

  return (
    <Routes>
      <Route path="/" element={<Inicio productos={products} listado={listado} busqueda={busqueda} setBusqueda={cambiarBusqueda} cantidadResultados={productosFiltrados.length} asistentes={asistentes} guardarProducto={guardarProducto} productoAEditar={productoAEditar} cancelarEdicion={() => setProductoAEditar(null)} puedeGuardar={Boolean(conexion && usuario) && !loading && !error} />} />
      <Route path="/admin/cupones" element={<ProtectedRoute><GestionCupones /></ProtectedRoute>} />
      <Route path="/productos/:id" element={loading ? <p role="status">Cargando producto...</p> : error ? <p className="error-equipo" role="alert">{error}</p> : <DetalleProducto productos={products} />} />
      <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
    </Routes>
  )
}

export default ItemListContainer
