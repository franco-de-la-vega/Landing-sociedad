"use client";

import { useEffect, useRef } from "react";

/** Inyecta el snippet de dLocal tal cual lo pegó Franco — un <script> con
 * lógica inline no se ejecuta si se mete por dangerouslySetInnerHTML, hay
 * que crear el nodo <script> a mano para que el navegador lo corra. */
export default function CheckoutDlocal({ snippet }: { snippet: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const match = snippet.match(/<script([^>]*)>([\s\S]*)<\/script>/);
    if (!match) return;
    const [, attrsStr, code] = match;

    const script = document.createElement("script");
    const attrMatches = attrsStr.matchAll(/([\w-]+)="([^"]*)"/g);
    for (const [, name, value] of attrMatches) {
      script.setAttribute(name, value);
    }
    script.text = code;
    host.appendChild(script);

    // El botón que crea dLocal viene rosa por defecto — lo pintamos dorado
    // para que combine con la página apenas aparece en el DOM.
    const pintar = (btn: HTMLElement) => {
      btn.style.setProperty("background-color", "#b8935a", "important");
      btn.style.setProperty("border-color", "#b8935a", "important");
      btn.style.setProperty("color", "#0b0c0e", "important");
      btn.style.setProperty("border-radius", "9999px", "important");
      btn.style.setProperty("width", "100%", "important");
      btn.style.setProperty("padding", "16px 24px", "important");
      btn.style.setProperty("font-weight", "700", "important");
      btn.style.setProperty("letter-spacing", "0.08em", "important");
      btn.style.setProperty("box-shadow", "none", "important");
    };

    const existente = host.querySelector("button");
    if (existente) pintar(existente as HTMLElement);

    const observer = new MutationObserver(() => {
      const btn = host.querySelector("button");
      if (btn) pintar(btn as HTMLElement);
    });
    observer.observe(host, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      host.innerHTML = "";
    };
  }, [snippet]);

  return <div ref={hostRef} className="w-full" />;
}
