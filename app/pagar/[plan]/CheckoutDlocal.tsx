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

    return () => {
      host.innerHTML = "";
    };
  }, [snippet]);

  return <div ref={hostRef} />;
}
