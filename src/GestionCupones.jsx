import { useEffect, useState } from 'react'
// El SDK se carga al abrir la sección para permitir configurar Firebase más adelante.
const version = '10.14.1'

async function conectarCupones() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  if (!projectId || !apiKey) {
    throw new Error('Configura VITE_FIREBASE_PROJECT_ID y VITE_FIREBASE_API_KEY para administrar los cupones.')
  }
  const appUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-app.js`
  const firestoreUrl = `https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`
  const [appSdk, firestore] = await Promise.all([
    import(/* @vite-ignore */ appUrl),
    import(/* @vite-ignore */ firestoreUrl),
  ])
  const nombre = 'talentotech'
  const app = appSdk.getApps().find((existente) => existente.name === nombre) ||
    appSdk.initializeApp({ projectId, apiKey, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN }, nombre)
  return { firestore, coleccion: firestore.collection(firestore.getFirestore(app), 'cupones') }
}


function GestionCupones() {
  const [conexion, setConexion] = useState(null)
  const [cupones, setCupones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [codigo, setCodigo] = useState('')
  const [porcentaje, setPorcentaje] = useState('')

  useEffect(() => {
    let activo = true
    let cancelar = () => {}
    conectarCupones().then((resultado) => {
      if (!activo) return
      setConexion(resultado)
      cancelar = resultado.firestore.onSnapshot(resultado.coleccion, (snapshot) => {
        if (!activo) return
        setCupones(snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() })))
        setCargando(false)
        setError('')
      }, () => {
        if (!activo) return
        setCargando(false)
        setError('No se pudieron consultar los cupones. Verifica la conexión y los permisos de Firestore.')
      })
    }).catch((fallo) => {
      if (!activo) return
      setCargando(false)
      setError(fallo.message || 'No se pudo conectar con Firestore.')
    })
    return () => { activo = false; cancelar() }
  }, [])

  async function crearCupon(evento) {
    evento.preventDefault()
    const codigoLimpio = codigo.trim()
    const descuento = Number(porcentaje)
    if (!conexion || ocupado) return
    if (!codigoLimpio || porcentaje === '' || !Number.isFinite(descuento) || descuento <= 0 || descuento > 100) {
      setError('Ingresa un código y un descuento mayor que 0 y de hasta 100%.')
      return
    }
    setOcupado(true); setError(''); setMensaje('')
    try {
      await conexion.firestore.addDoc(conexion.coleccion, { codigo: codigoLimpio, porcentaje: descuento })
      setCodigo(''); setPorcentaje(''); setMensaje('Cupón creado correctamente.')
    } catch {
      setError('No se pudo guardar el cupón. Verifica la conexión y los permisos de Firestore.')
    } finally { setOcupado(false) }
  }

  async function eliminarCupon(id) {
    if (!conexion || ocupado) return
    setOcupado(true); setError(''); setMensaje('')
    try {
      await conexion.firestore.deleteDoc(conexion.firestore.doc(conexion.coleccion, id))
      setMensaje('Cupón eliminado correctamente.')
    } catch {
      setError('No se pudo eliminar el cupón. Verifica la conexión y los permisos de Firestore.')
    } finally { setOcupado(false) }
  }

  return (
    <section className="cupones" aria-labelledby="titulo-cupones">
      <title>Administrar cupones | Talento Tech</title>
      <meta name="robots" content="noindex" />
      <h2 id="titulo-cupones">Cupones de descuento</h2>
      <p className="introduccion-seccion">Crea y administra los descuentos disponibles.</p>
      <form className="producto-form formulario-cupon" onSubmit={crearCupon}>
        <label htmlFor="cupon-codigo">Código del cupón</label>
        <input id="cupon-codigo" value={codigo} onChange={(evento) => setCodigo(evento.target.value)} required maxLength={100} />
        <label htmlFor="cupon-porcentaje">Descuento (%)</label>
        <input id="cupon-porcentaje" type="number" min="0.01" max="100" step="any" value={porcentaje} onChange={(evento) => setPorcentaje(evento.target.value)} required />
        <button type="submit" disabled={!conexion || ocupado}>Crear cupón</button>
      </form>
      {error && <p className="error-equipo" role="alert">{error}</p>}
      <p role="status">{mensaje}</p>
      {cargando ? <p role="status">Cargando cupones...</p> : !conexion ? null : cupones.length === 0 ? <p>No hay cupones disponibles.</p> : (
        <ul className="lista-cupones">
          {cupones.map((cupon) => (
            <li key={cupon.id}>
              <div><strong>{cupon.codigo}</strong><span>{cupon.porcentaje}% de descuento</span></div>
              <button type="button" disabled={ocupado} onClick={() => eliminarCupon(cupon.id)} aria-label={`Eliminar cupón ${cupon.codigo}`}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default GestionCupones
