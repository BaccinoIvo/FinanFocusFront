import { useEffect, useLayoutEffect } from "react";

// Elementos de la portada que aparecen con un suave desplazamiento al entrar en pantalla.
const REVELAR = ".landing .sec .wrap > *, .landing .cta .in, .landing .feats article, .landing .plan, .landing .person";
// Tarjetas con un brillo dorado que sigue al cursor.
const BRILLO = ".landing .feats article, .landing .plan, .landing .person, .landing .panel, .landing .compare > div";

/**
 * Efectos de la portada: barra de progreso de lectura, aparición al scrollear y brillo en las tarjetas.
 * Todo se desactiva si la persona pidió reducir las animaciones. `raiz` es la ref del contenedor .landing.
 */
const useEfectosLanding = (raiz) => {
  // Se marca antes de pintar, así los elementos no se ven un instante y después desaparecen.
  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const nodos = [...el.querySelectorAll(REVELAR)];
    nodos.forEach((n, i) => { n.classList.add("rv"); n.style.setProperty("--d", `${(i % 3) * 0.08}s`); });
    el.querySelectorAll(BRILLO).forEach((n) => n.classList.add("brillo"));
    return () => nodos.forEach((n) => n.classList.remove("rv", "vis"));
  }, [raiz]);

  useEffect(() => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("vis"); observador.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    el.querySelectorAll(".rv").forEach((n) => observador.observe(n));

    let cuadro = 0;
    const progreso = () => {
      cuadro = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--scroll", total > 0 ? Math.min(1, window.scrollY / total) : 0);
      el.setAttribute("data-scrolled", window.scrollY > 24 ? "1" : "0");
    };
    const alScroll = () => { if (!cuadro) cuadro = requestAnimationFrame(progreso); };
    window.addEventListener("scroll", alScroll, { passive: true });
    progreso();

    const alMover = (e) => {
      const t = e.target.closest?.(".brillo");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", alMover);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alScroll);
      el.removeEventListener("pointermove", alMover);
    };
  }, [raiz]);
};

export default useEfectosLanding;
