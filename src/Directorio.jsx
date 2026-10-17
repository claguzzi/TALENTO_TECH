import TarjetaContacto from './TarjetaContacto'

function Directorio({ usuarios, cargando, error }) {
  return (
    <section className="seccion-equipo" aria-labelledby="titulo-equipo" aria-busy={cargando}>
      <h2 id="titulo-equipo">Nuestro equipo</h2>
      {cargando ? (
        <p role="status">Cargando equipo...</p>
      ) : error ? (
        <p className="error-equipo" role="alert">{error}</p>
      ) : usuarios.length === 0 ? (
        <p>No hay integrantes para mostrar.</p>
      ) : (
        <div className="equipo">
          {usuarios.map((persona) => (
            <TarjetaContacto
              key={persona.id}
              foto={persona.foto}
              nombre={persona.nombre}
              puesto={persona.puesto}
              email={persona.email}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Directorio
