import { useEffect } from "react";

/**
 * Calcula cuánto se avanzó dentro de una escena alta con contenido fijo (sticky) y lo expone como la
 * variable CSS --p (de 0 a 1). También marca data-fase="2" cuando ya pasó la mitad, para habilitar los botones.
 * Con "reducir animaciones" no escucha el scroll: la escena queda estática.
 */
const useProgresoEscena = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let cuadro = 0;
    const actualizar = () => {
      cuadro = 0;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.fase = p > 0.5 ? "2" : "1";
    };
    const alScroll = () => { if (!cuadro) cuadro = requestAnimationFrame(actualizar); };
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    actualizar();
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, [ref]);
};

export default useProgresoEscena;
