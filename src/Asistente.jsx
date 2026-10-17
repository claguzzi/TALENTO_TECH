function Asistente({ nombre, tarea, emoji }) {
  return (
    <div className="asistente">
      <h3>{nombre}</h3>
      <p>
        <span aria-hidden="true">{emoji}</span> {tarea}
      </p>
    </div>
  )
}

export default Asistente
