"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");

  const isValid = nombre.trim().length > 0 && email.trim().length > 0 && mensaje.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje, sitioWeb }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Header />
      <main className="relative min-h-screen px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-lg">
          <Reveal>
            <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.4rem]">
              Contactanos
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              ¿Tenés una consulta puntual? Escribinos y te respondemos a la
              brevedad.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-8">
            {status === "success" ? (
              <div className="glass-panel rounded-[var(--radius-panel)] p-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent">
                  <Check size={18} strokeWidth={2} className="text-accent" />
                </span>
                <p className="mt-6 text-[17px] font-medium tracking-tight">
                  Recibimos tu mensaje.
                </p>
                <p className="mt-2 text-[14px] text-text-secondary">
                  Te respondemos a la brevedad por email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-5 rounded-[var(--radius-panel)] p-7 sm:p-10">
                {/* honeypot: oculto para personas, los bots de autocompletado lo llenan igual */}
                <input
                  type="text"
                  name="sitioWeb"
                  value={sitioWeb}
                  onChange={(e) => setSitioWeb(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
                />
                <div>
                  <label className="mb-3 block text-[15px] font-medium tracking-tight">Nombre</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-[15px] font-medium tracking-tight">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-[15px] font-medium tracking-tight">Mensaje</label>
                  <textarea
                    className="form-input"
                    placeholder="Contanos en qué te podemos ayudar"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <p className="text-[13px] font-medium text-red-500">
                    No pudimos enviar tu mensaje. Probá de nuevo en unos segundos.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isValid || status === "loading"}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent px-6 py-3.5 text-[14px] font-semibold tracking-tight text-white transition-all duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "loading" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <a
              href="mailto:ilfcformacion@gmail.com"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-text-secondary transition-colors hover:text-accent"
            >
              <Mail size={15} strokeWidth={2} />
              ilfcformacion@gmail.com
            </a>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
