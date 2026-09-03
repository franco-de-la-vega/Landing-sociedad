"use client";

import { useEffect, useRef, useState } from "react";

const labels = [
  "Inicio",
  "Mercado",
  "Ingresos",
  "Perfil",
  "Sistema",
  "Admisión",
  "Método",
  "Programa",
  "Performance",
  "Portafolio",
  "Empleabilidad",
  "Evolución",
  "Casos",
  "Etapas",
  "Comparación",
  "FAQ",
  "Precios",
];

export default function SectionNav() {
  const [active, setActive] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const activeRef = useRef(0);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const sections = Array.from(main.querySelectorAll(":scope > section")) as HTMLElement[];
    sectionsRef.current = sections;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              activeRef.current = idx;
              setActive(idx);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(i, sectionsRef.current.length - 1));
    sectionsRef.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    function isTypingTarget(el: EventTarget | null) {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(activeRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(activeRef.current - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex"
      aria-label="Navegación de secciones"
    >
      {labels.map((label, i) => {
        const isActive = active === i;
        return (
          <button
            key={label}
            onClick={() => goTo(i)}
            className="group flex items-center gap-2.5"
            aria-label={`Ir a ${label}`}
            aria-current={isActive}
          >
            <span
              className={`whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                isActive ? "opacity-0" : ""
              }`}
              style={{ background: "var(--color-bg-elevated)" }}
            >
              {label}
            </span>
            <span
              className={`block shrink-0 rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2.5 w-2.5 bg-[var(--color-accent)]"
                  : "h-1.5 w-1.5 bg-[var(--color-border-strong)] group-hover:bg-[var(--color-accent)]/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
