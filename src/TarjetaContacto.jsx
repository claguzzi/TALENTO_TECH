function TarjetaContacto({ foto, nombre, puesto, email }) {
  return (
    <article className="persona">
      <img src={foto} alt={`Foto de ${nombre}`} width="96" height="96" />
      <h3>{nombre}</h3>
      <p>{puesto}</p>
      <a href={`mailto:${email}`}>{email}</a>
    </article>
  )
}

export default TarjetaContacto
