import { useEffect, useRef, useState } from "react";
import { dibujarPrimeraPagina } from "../utils/pdf";

// Etapas que se muestran mientras la IA lee el comprobante. Los tiempos son una guía:
// la lectura real tarda entre 3 y 15 segundos según la carga del servicio.
const ETAPAS = [
  { desde: 0, texto: "Subiendo comprobante de forma segura" },
  { desde: 2, texto: "Analizando estructura y formato" },
  { desde: 4, texto: "Identificando monto, moneda y fecha" },
  { desde: 7, texto: "Verificando los datos extraídos" },
];

const ComprobanteEscaner = ({ archivo, leyendo, segundos }) => {
  const esImagen = archivo.type.startsWith("image/");
  // La miniatura se dibuja en un canvas desde el archivo local (no se sube nada para mostrarla).
  // PDF: primera página real; pdf.js es pesado, por eso se descarga solo al subir un PDF.
  const esPdf = archivo.type === "application/pdf";
  const canvas = useRef(null);
  const [falloPdf, setFalloPdf] = useState(false);
  useEffect(() => {
    if (!esPdf && !esImagen) return undefined;
    let cancelado = false;
    (async () => {
      try {
        const ancho = 240 * Math.min(window.devicePixelRatio || 1, 2);
        let ok;
        if (esPdf) {
          ok = await dibujarPrimeraPagina(archivo, canvas.current, ancho, () => cancelado || !canvas.current);
        } else {
          const bitmap = await createImageBitmap(archivo);
          ok = !cancelado && !!canvas.current;
          if (ok) {
            const escala = Math.min(1, ancho / bitmap.width);
            canvas.current.width = Math.round(bitmap.width * escala);
            canvas.current.height = Math.round(bitmap.height * escala);
            canvas.current.getContext("2d").drawImage(bitmap, 0, 0, canvas.current.width, canvas.current.height);
          }
          bitmap.close?.();
        }
        if (!cancelado) setFalloPdf(!ok);
      } catch (e) {
        console.warn("Miniatura no disponible:", e);
        if (!cancelado) setFalloPdf(true); // PDF protegido o dañado: se muestra la hoja genérica
      }
    })();
    return () => { cancelado = true; };
  }, [archivo, esPdf, esImagen]);

  const etapaActual = ETAPAS.reduce((acc, e, i) => (segundos >= e.desde ? i : acc), 0);
  const extension = (archivo.name.split(".").pop() ?? "").slice(0, 4).toUpperCase();

  return (
    <div className="escaner-bloque">
      <div className={`escaner-doc${leyendo ? " escaneando" : ""}`} aria-hidden="true">
        {(esImagen || esPdf) && !falloPdf ? (
          <canvas ref={canvas} />
        ) : (
          <div className="escaner-hoja">
            <span className="escaner-ext">{extension}</span>
            {[80, 95, 60, 90, 70, 85].map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}
          </div>
        )}
        {leyendo && <span className="escaner-linea" />}
      </div>

      {leyendo && (
        <ol className="escaner-etapas" role="status" aria-live="polite" aria-label="Progreso de la lectura">
          {ETAPAS.map((e, i) => (
            <li key={e.texto} className={i < etapaActual ? "hecha" : i === etapaActual ? "actual" : ""}>
              <span className="punto" aria-hidden="true">{i < etapaActual ? "✓" : ""}</span>
              {e.texto}{i === etapaActual ? "…" : ""}
            </li>
          ))}
          <li className="escaner-tiempo">
            {segundos} s · {segundos >= 12 ? "La IA está con mucha demanda, ya casi. No cierres esta pantalla." : "Suele tardar entre 3 y 15 segundos."}
          </li>
        </ol>
      )}
    </div>
  );
};

export default ComprobanteEscaner;
