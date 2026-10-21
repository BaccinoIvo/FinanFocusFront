const Paginacion = ({ page, totalPaginas, onCambiar }) => {
  if (totalPaginas <= 1) return null;
  return (
    <nav className="paginacion" aria-label="Paginación">
      <button className="btn btn-sec" onClick={() => onCambiar(page - 1)} disabled={page <= 1}>← Anterior</button>
      <span className="suave">Página {page} de {totalPaginas}</span>
      <button className="btn btn-sec" onClick={() => onCambiar(page + 1)} disabled={page >= totalPaginas}>Siguiente →</button>
    </nav>
  );
};

export default Paginacion;
