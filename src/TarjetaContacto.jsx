function TarjetaContacto({ fotoURL, nombre, rol, linkedinURL }) {
  let enlaceSeguro = false
  try {
    const url = new URL(linkedinURL)
    enlaceSeguro = url.protocol === 'https:' && (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))
  } catch {
    enlaceSeguro = false
  }

  return (
    <article className="persona">
      {fotoURL && <img src={fotoURL} alt={`Foto de ${nombre}`} width="96" height="96" loading="lazy" />}
      <h3>{nombre}</h3>
      <p>{rol}</p>
      {enlaceSeguro && <a href={linkedinURL} target="_blank" rel="noopener noreferrer">Ver perfil de LinkedIn <span aria-hidden="true">↗</span></a>}
    </article>
  )
}

export default TarjetaContacto
