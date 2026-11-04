import { useEffect } from "react";

const ANIMACIONES_REDUCIDAS = "(prefers-reduced-motion: reduce)";
const FRACCION_RODILLA = 0.46; // parte del video que se recorre mientras hay texto en pantalla

/**
 * Recorre un video con el scroll (nunca lo reproduce).
 *   - Mide la pista: largo = fondo del último bloque + 0,75 de pantalla; alto total = largo + 1 pantalla.
 *   - Dos tramos: mientras hay texto, el video avanza hasta 46 %; después, de 46 % a 100 %.
 *   - Suaviza con una interpolación por cuadro y solo busca un nuevo instante cuando el video no está buscando.
 *   - Expone el avance como la variable CSS --p (0 a 1) para el velo final.
 * Con "reducir animaciones" no hace nada: la pista queda estática (el CSS se ocupa).
 */
const useVideoScroll = (pistaRef, videoRef, ultimoRef) => {
  useEffect(() => {
    const pista = pistaRef.current;
    const video = videoRef.current;
    const ultimo = ultimoRef.current;
    if (!pista || !video || !ultimo) return undefined;
    const contenido = pista.querySelector(".vid-contenido");
    const menu = document.querySelector(".topbar");

    if (window.matchMedia(ANIMACIONES_REDUCIDAS).matches) {
      const mostrarCuadro = () => { if (video.duration) video.currentTime = video.duration * 0.4; };
      if (video.readyState >= 1) mostrarCuadro();
      else video.addEventListener("loadedmetadata", mostrarCuadro, { once: true });
      return undefined;
    }

    let fin = 1;
    let rodilla = 0.5;
    let objetivo = 0;
    let actual = 0;
    let cuadro = 0;

    const medir = () => {
      const vh = window.innerHeight;
      const fondo = ultimo.offsetTop + ultimo.offsetHeight;
      fin = fondo + vh * 0.75;
      rodilla = fondo / fin;
      pista.style.height = `${fin + vh}px`;
    };

    const calcularObjetivo = () => {
      const arriba = pista.getBoundingClientRect().top + window.scrollY;
      const p = Math.min(1, Math.max(0, (window.scrollY - arriba) / fin));
      pista.style.setProperty("--p", p.toFixed(4));
      // El texto desaparece al llegar al menú: nada se superpone con él cuando se sube.
      if (contenido) contenido.style.clipPath = `inset(${Math.max(0, window.scrollY - arriba + (menu?.offsetHeight ?? 72))}px 0 0 0)`;
      // El menú se vuelve negro recién cuando la escena ya terminó de fundirse a negro (el velo llega a 1 en p ≈ 0,94).
      pista.parentElement?.setAttribute("data-nav-solido", p >= 0.94 ? "1" : "0");
      const dur = video.duration;
      if (!dur || !Number.isFinite(dur)) return;
      const clip = p < rodilla
        ? (p / rodilla) * FRACCION_RODILLA
        : FRACCION_RODILLA + ((p - rodilla) / (1 - rodilla)) * (1 - FRACCION_RODILLA);
      objetivo = clip * (dur - 1 / 48);
    };

    const buscar = () => {
      if (!video.seeking && Math.abs(video.currentTime - actual) > 1 / 60) video.currentTime = actual;
    };

    const bucle = () => {
      actual += (objetivo - actual) * 0.22;
      if (Math.abs(objetivo - actual) < 0.0005) actual = objetivo;
      buscar();
      cuadro = Math.abs(objetivo - actual) > 0.0005 || video.seeking ? requestAnimationFrame(bucle) : 0;
    };
    const despertar = () => { if (!cuadro) cuadro = requestAnimationFrame(bucle); };

    const alScroll = () => { calcularObjetivo(); despertar(); };
    const alMedidas = () => { medir(); calcularObjetivo(); despertar(); };
    const alBuscado = () => { if (!cuadro) despertar(); };

    medir();
    calcularObjetivo();
    video.addEventListener("loadedmetadata", alMedidas);
    video.addEventListener("seeked", alBuscado);
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alMedidas);
    document.fonts?.ready.then(alMedidas);
    despertar();

    return () => {
      cancelAnimationFrame(cuadro);
      video.removeEventListener("loadedmetadata", alMedidas);
      video.removeEventListener("seeked", alBuscado);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alMedidas);
    };
  }, [pistaRef, videoRef, ultimoRef]);
};

export default useVideoScroll;
