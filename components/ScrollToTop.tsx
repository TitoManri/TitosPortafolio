"use client";

import { useEffect } from "react";

/**
 * Fuerza la posición de scroll al inicio de la página en cada carga/recarga.
 *
 * Motivo: el navegador restaura por defecto la última posición de scroll del
 * historial (`history.scrollRestoration = "auto"`). Como el Hero y la sección
 * de Experience se montan de forma diferida (`ssr: false`), esa restauración
 * ocurre con el layout aún incompleto y deja la página a mitad de sección.
 *
 * Aquí desactivamos esa restauración y anclamos la ventana al top en el primer
 * render del cliente, por lo que siempre se entra directamente al hero.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Evita que el navegador reaplique su posición guardada al terminar la carga.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Los componentes diferidos (`ssr: false`) montan después del primer paint y
    // pueden alterar la altura del documento, disparando un scroll heredado.
    // Reanclamos al top una vez que la hidratación se ha asentado.
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    return () => {
      cancelAnimationFrame(raf);
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  return null;
}
