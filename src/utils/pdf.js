// Dibuja la primera página de un PDF en un canvas. pdf.js es pesado: se descarga recién cuando hace falta.
// Se usa la versión "legacy" porque funciona también en navegadores un poco más viejos.
export const dibujarPrimeraPagina = async (archivo, canvas, anchoObjetivo, cancelado = () => false) => {
  const [pdfjs, { default: worker }] = await Promise.all([
    import("pdfjs-dist/legacy/build/pdf.mjs"),
    import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const tarea = pdfjs.getDocument({ data: await archivo.arrayBuffer() });
  const documento = await tarea.promise;
  try {
    const pagina = await documento.getPage(1);
    const base = pagina.getViewport({ scale: 1 });
    const vista = pagina.getViewport({ scale: anchoObjetivo / base.width });
    if (cancelado()) return false;
    canvas.width = vista.width;
    canvas.height = vista.height;
    await pagina.render({ canvasContext: canvas.getContext("2d", { willReadFrequently: true }), viewport: vista }).promise;
    return true;
  } finally {
    tarea.destroy();
  }
};
