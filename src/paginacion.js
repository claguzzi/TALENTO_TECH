export function paginar(items, pagina, porPagina) {
  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina))
  const paginaActual = Math.max(1, Math.min(pagina, totalPaginas))
  const inicio = (paginaActual - 1) * porPagina
  return { paginaActual, totalPaginas, items: items.slice(inicio, inicio + porPagina) }
}
