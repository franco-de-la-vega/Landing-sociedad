"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import TiltCard from "@/components/TiltCard";
import Magnetic from "@/components/Magnetic";
import Watermark from "@/components/Watermark";

/**
 * Landing de SEGUIMIENTO comercial — no es la landing de venta (esa es
 * /presentacion). Esta la manda el closer por WhatsApp a un prospecto que ya
 * tuvo una llamada y no decidió en el momento.
 *
 * Filosofía (Franco): "vender sin vender". Tres capas, en ese orden, sin
 * mezclarlas — dolor → posibilidad → una mención breve de ILFC al cierre.
 * Nada de pensum, sprints, precios ni metodología: eso es trabajo de
 * /presentacion y /curricula, no de esta pieza.
 *
 * Diseño: cero tokens nuevos, mismo lenguaje visual que el resto del sitio
 * (theme.css, Reveal/RevealGroup, .text-metal, el mismo tratamiento oscuro
 * de ManifestoSection/CTASection para los momentos de mayor peso).
 */

const ESPEJO_ITEMS = [
  "Te levantás temprano.",
  "Te desplazás.",
  "Trabajás.",
  "Volvés cansado.",
  "Pagás tus gastos.",
  "Al día siguiente, volvés a empezar.",
];

const TIEMPO_ITEMS = [
  "Tiempo con tu familia.",
  "Tiempo con tu pareja.",
  "Tiempo para tus hijos.",
  "Tiempo para hacer ejercicio.",
  "Tiempo para aprender algo nuevo.",
  "Tiempo para emprender.",
  "Tiempo, simplemente, para vivir.",
];

const DINERO_ITEMS = ["Inflación", "Costo de vida", "Transporte", "Vivienda", "Alimentación", "Impuestos", "Incertidumbre económica"];

const HABILIDAD_ITEMS = [
  "Conseguir oportunidades.",
  "Negociar.",
  "Emprender.",
  "Hacer crecer un negocio.",
  "Comunicar una propuesta.",
  "Entender necesidades.",
  "Generar oportunidades comerciales.",
];

export default function SeguimientoPage() {
  return (
    <>
      <Header />
      <main className="bg-[var(--color-bg-base)]">
        <Hero />
        <Espejo />
        <Tiempo />
        <Dinero />
        <ProblemaLatam />
        <Pregunta />
        <NuevaForma />
        <MercadoInternacional />
        <Comisiones />
        <TieneAlgoPropio />
        <HabilidadDeVida />
        <NoSolo />
        <Decision />
        <NoRenuncies />
        <Cierre />
      </main>
    </>
  );
}

// ─────────────── Bloques compartidos (mismo grammar que ManifestoSection) ───────────────

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`border-t border-black/10 px-6 py-28 sm:px-8 sm:py-36 ${className}`}>
      <div className="mx-auto max-w-[680px]">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{children}</span>;
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-metal mt-5 text-[2.1rem] font-bold leading-[1.18] tracking-[-0.02em] sm:text-[3rem]">{children}</h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[540px] text-[16.5px] leading-relaxed text-[var(--color-text-secondary)]">{children}</p>;
}

function Bold({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-10 text-[1.4rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-[1.7rem]">
      {children}
    </p>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <RevealGroup stagger={0.08} className="mt-9 flex flex-col divide-y divide-black/10 border-t border-b border-black/10">
      {items.map((it) => (
        <RevealItem key={it}>
          <p className="py-3 pl-4 text-[16px] leading-snug text-[var(--color-text-primary)]" style={{ borderLeft: "2px solid var(--color-accent)" }}>
            {it}
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2.5">
      {items.map((it, i) => (
        <Reveal key={it} delay={i * 0.04}>
          <span className="inline-block rounded-full px-4 py-2 text-[13.5px] font-medium text-[var(--color-accent-secondary)]" style={{ background: "var(--color-accent-muted)" }}>
            {it}
          </span>
        </Reveal>
      ))}
    </div>
  );
}

// ─────────────── 01 · Hero ───────────────

function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <Reveal>
        <Kicker>Instituto Latinoamericano de Formación Comercial</Kicker>
      </Reveal>
      <Reveal delay={0.1} className="mt-8 max-w-[820px]">
        <h1 className="text-metal text-[2.3rem] font-bold leading-[1.14] tracking-[-0.02em] sm:text-[3.6rem]">
          ¿Estás cansado de tu trabajo…
          <br />
          <span className="font-serif-display italic font-normal text-[var(--color-accent)]">
            o de la vida que tu trabajo te está dando?
          </span>
        </h1>
      </Reveal>
      <Reveal delay={0.22} className="mt-7 max-w-[540px]">
        <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
          Tal vez el problema no sea que no querés trabajar. Tal vez estás cansado de trabajar de una forma que ya no
          encaja con la vida que querés tener.
        </p>
      </Reveal>
      <Reveal delay={0.36} className="mt-16">
        <Magnetic strength={0.5} className="inline-flex cursor-default flex-col items-center gap-2 text-[var(--color-text-muted)]">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em]">Seguir leyendo</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-[15px]">
            ↓
          </motion.span>
        </Magnetic>
      </Reveal>
    </section>
  );
}

// ─────────────── 02 · El espejo ───────────────

function Espejo() {
  const loop = [...ESPEJO_ITEMS, ...ESPEJO_ITEMS];
  return (
    <section className="relative overflow-hidden border-t border-black/10 py-28 sm:py-36">
      <div className="mx-auto max-w-[680px] px-6 sm:px-8">
        <Reveal>
          <Kicker>Tener trabajo no es lo mismo que estar bien</Kicker>
          <H>La rutina que ya conocés</H>
        </Reveal>
      </div>

      {/* Ticker full-bleed: la rutina no cabe en un párrafo prolijo, se
          repite sin parar — el diseño tiene que sentirse igual de relentless
          que lo que describe. */}
      <Reveal delay={0.15} className="mt-14">
        <div
          className="relative w-full overflow-hidden py-2"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="marquee-track flex w-max items-center gap-10">
            {loop.map((it, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                <span className="text-metal text-[2.4rem] font-bold tracking-[-0.02em] sm:text-[3.2rem]">{it}</span>
                <span className="text-[1.6rem] text-[var(--color-accent)]/50">✦</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-14 max-w-[680px] px-6 sm:px-8">
        <Reveal delay={0.3}>
          <Bold>¿Cuánto de tu vida estás entregando a cambio de tu ingreso?</Bold>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────── 03 · El tiempo ───────────────

function Tiempo() {
  return (
    <Section>
      <Reveal>
        <Kicker>No es solo el dinero</Kicker>
        <H>¿Cuándo fue la última vez que sentiste que tenías tiempo para vos?</H>
        <Lead>Tu trabajo actual también puede estar costándote algo que el dinero no devuelve tan fácil.</Lead>
      </Reveal>
      <List items={TIEMPO_ITEMS} />
      <Reveal delay={0.4}>
        <Bold>Hay cosas que el dinero no puede devolverte cuando ya perdiste el tiempo.</Bold>
      </Reveal>
    </Section>
  );
}

// ─────────────── 04 · El dinero ───────────────

function Dinero() {
  const nodos = [
    { label: "Trabajás", top: "2%", left: "50%" },
    { label: "Cumplís", top: "50%", left: "94%" },
    { label: "Pagás", top: "94%", left: "50%" },
    { label: "Volvés a empezar", top: "50%", left: "6%" },
  ];
  return (
    <section className="relative overflow-hidden border-t border-black/10 bg-[#0A0B0D] px-6 py-28 sm:px-8 sm:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "34px 34px" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[680px]">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/40">Y a veces, ni siquiera alcanza</span>
          <h2 className="mt-5 text-[2.1rem] font-bold leading-[1.18] tracking-[-0.02em] text-white sm:text-[3rem]">
            El mismo círculo, mes tras mes.
          </h2>
          <p className="mt-5 max-w-[480px] text-[16.5px] leading-relaxed text-white/55">
            ¿Qué pasa cuando tu ingreso apenas alcanza para mantener tu vida actual?
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-16 aspect-square w-full max-w-[300px]">
          <div className="relative h-full w-full">
            <motion.svg
              viewBox="0 0 300 300"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="150" cy="150" r="128" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="1 10" strokeLinecap="round" opacity={0.55} />
            </motion.svg>
            <div className="absolute left-1/2 top-1/2 h-[164px] w-[164px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 72%)", opacity: 0.1 }} />
            {nodos.map((n) => (
              <span
                key={n.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.08em] text-white/85"
                style={{ top: n.top, left: n.left }}
              >
                {n.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3} className="mt-16 flex flex-wrap justify-center gap-2.5">
          {DINERO_ITEMS.map((it) => (
            <span key={it} className="inline-block rounded-full px-4 py-2 text-[13px] font-medium text-white/70" style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
              {it}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────── 05 · El problema latinoamericano ───────────────

function ProblemaLatam() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const ruleScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const filas = ["Tu tiempo", "Tu trabajo", "Ingreso en moneda local", "Costo de vida ↑", "Poder adquisitivo ↓"];

  return (
    <section ref={ref} className="relative border-t border-black/10 px-6 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[680px]">
        <Reveal>
          <Kicker>Una realidad regional</Kicker>
          <H>Tu esfuerzo no siempre crece al mismo ritmo que el costo de vivir</H>
          <Lead>Especialmente en economías donde el ingreso está atado a una sola moneda local.</Lead>
        </Reveal>

        <div className="relative mt-10 inline-flex flex-col items-start pl-6">
          <motion.div style={{ scaleY: ruleScale }} className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent)]/40 to-transparent" />
          {filas.map((f, i) => (
            <Reveal key={f} delay={i * 0.08} className="py-2">
              <span className="font-mono text-[15px] font-semibold" style={{ color: i >= 3 ? "#a04b3a" : "var(--color-text-primary)" }}>
                {f}
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35}>
          <Bold>Trabajar más no siempre significa avanzar más.</Bold>
        </Reveal>
        <Reveal delay={0.45}>
          <Lead>
            Cuando tu ingreso depende exclusivamente de una moneda local, las decisiones económicas de tu país también
            pueden terminar afectando tu capacidad de proyectar tu vida.
          </Lead>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────── 06 · La pregunta ───────────────

function Pregunta() {
  return (
    <section className="flex min-h-[85vh] items-center justify-center border-t border-black/10 px-6 text-center">
      <Reveal>
        <p className="text-metal max-w-[720px] text-[2rem] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[2.8rem]">
          ¿Y si no necesitaras depender de una única fuente de ingresos?
        </p>
        <div className="mx-auto mt-9 max-w-[440px] space-y-1.5 text-[15px] text-[var(--color-text-secondary)]">
          <p>No significa abandonar mañana tu trabajo.</p>
          <p>No significa empezar de cero.</p>
          <p>No significa apostar todo a una promesa de internet.</p>
        </div>
        <p className="mt-7 text-[17px] font-semibold text-[var(--color-accent-secondary)]">
          Significa desarrollar una habilidad que puedas usar en distintos contextos comerciales.
        </p>
      </Reveal>
    </section>
  );
}

// ─────────────── 07 · Una nueva forma de trabajar ───────────────

function NuevaForma() {
  const pasos = ["Empresa", "Mercado", "Clientes", "Profesional comercial", "Remoto"];
  const skills = ["Comunicarse", "Vender", "Negociar", "Atender clientes", "Generar oportunidades", "Hacer seguimiento", "Cerrar negocios"];
  return (
    <Section>
      <Reveal>
        <Kicker>Existe otra forma</Kicker>
        <H>El mundo del trabajo también está cambiando</H>
        <Lead>Hoy existen empresas que necesitan profesionales capaces de:</Lead>
      </Reveal>

      <RevealGroup stagger={0.05} className="mt-7 flex flex-wrap gap-2.5">
        {skills.map((s) => (
          <RevealItem key={s}>
            <motion.span
              whileHover={{ y: -3, borderColor: "var(--color-accent)", color: "var(--color-accent-secondary)" }}
              transition={{ duration: 0.2 }}
              className="inline-block cursor-default rounded-full px-4 py-2 text-[13px] font-medium text-[var(--color-text-secondary)]"
              style={{ border: "1px solid var(--color-border-strong)" }}
            >
              {s}
            </motion.span>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Pipeline animado: un pulso dorado recorre el camino de punta a
          punta en loop — no es solo una fila de palabras con flechas. */}
      <Reveal delay={0.2} className="mt-14">
        <div className="relative w-full overflow-x-auto pb-2">
          <div className="relative flex min-w-max items-center gap-0 pt-2">
            <div className="absolute left-0 right-0 top-[19px] h-px" style={{ background: "var(--color-border-strong)" }} />
            <motion.div
              className="absolute top-[19px] h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", width: "22%" }}
              animate={{ left: ["-22%", "100%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {pasos.map((p, i) => (
              <div key={p} className="relative flex items-center">
                <div className="flex flex-col items-center gap-2.5 px-7">
                  <span
                    className="h-[9px] w-[9px] rounded-full"
                    style={{ background: i === pasos.length - 1 ? "var(--color-accent)" : "var(--color-bg-elevated)", border: "1.5px solid var(--color-accent)" }}
                  />
                  <span
                    className="whitespace-nowrap font-mono text-[13.5px] font-semibold"
                    style={{ color: i === pasos.length - 1 ? "var(--color-accent-secondary)" : "var(--color-text-primary)" }}
                  >
                    {p}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

// ─────────────── 08 · El mercado internacional ───────────────

const PAISES = [
  { label: "México", top: "6%", left: "12%" },
  { label: "Colombia", top: "58%", left: "2%" },
  { label: "Argentina", top: "88%", left: "22%" },
  { label: "España", top: "2%", left: "68%" },
  { label: "Chile", top: "78%", left: "78%" },
  { label: "Perú", top: "40%", left: "88%" },
  { label: "Estados Unidos", top: "22%", left: "40%" },
];

function MercadoInternacional() {
  return (
    <Section className="overflow-visible">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_320px]">
        <Reveal>
          <Kicker>Tu mercado es más grande de lo que pensás</Kicker>
          <H>Tu mercado no tiene por qué terminar en tu ciudad</H>
          <Lead>
            Un profesional comercial puede encontrar oportunidades en empresas de distintos mercados y países —
            especialmente dentro del ecosistema hispanohablante.
          </Lead>
          <Lead>
            Para determinadas posiciones internacionales existen empresas que trabajan con profesionales remotos bajo
            esquemas de salario fijo, variable y/o comisiones.
          </Lead>
          <p className="mt-8 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
            Las condiciones dependen de cada empresa, posición, experiencia, mercado y modalidad de contratación.
          </p>
        </Reveal>

        {/* Señal expandiéndose + países en constelación: el mercado no es un
            párrafo, es un alcance que se ve. */}
        <Reveal delay={0.2} className="relative mx-auto hidden aspect-square w-full max-w-[300px] sm:block">
          <div className="relative h-full w-full">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ border: "1px solid var(--color-accent)" }}
                initial={{ width: 16, height: 16, x: "-50%", y: "-50%", opacity: 0.7 }}
                animate={{ width: 300, height: 300, opacity: 0 }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeOut", delay: i * 1.2 }}
              />
            ))}
            <span
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            {PAISES.map((p, i) => (
              <motion.span
                key={p.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium text-[var(--color-accent-secondary)]"
                style={{ top: p.top, left: p.left, background: "var(--color-accent-muted)" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                {p.label}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

// ─────────────── 09 · Las comisiones ───────────────

function Comisiones() {
  const items = ["Salario base + variable", "Comisiones", "Bonificaciones por resultados", "Esquemas de compensación por desempeño"];
  const rot = [-4, 2, -2, 3];
  return (
    <Section>
      <Reveal>
        <Kicker>Tu resultado también cuenta</Kicker>
        <H>En ventas, tu ingreso puede estar relacionado con el valor que generás</H>
        <Lead>En determinados roles comerciales existen:</Lead>
      </Reveal>

      {/* Mazo apilado: cada componente de compensación es una capa más, no
          una línea más de una lista. En mobile se apilan en columna simple. */}
      <div className="relative mt-14 flex flex-col items-center gap-3 sm:block sm:h-[280px]">
        {items.map((it, i) => (
          <Reveal key={it} delay={i * 0.12} className="sm:absolute sm:left-1/2 sm:top-0 sm:w-[380px]">
            {/* Reveal ya anima su propio fade/translateY — el transform de
                apilado (posición/rotación) va en ESTE div, aparte, para que
                no compita por la misma propiedad CSS. El lift de hover va
                en el motion.div de más adentro, tercera capa. */}
            <div
              className="sm:[transform:translate(-50%,var(--stack-y))_rotate(var(--stack-r))]"
              style={{ "--stack-y": `${i * 46}px`, "--stack-r": `${rot[i]}deg` } as React.CSSProperties}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 16px 34px -12px rgba(20,18,14,0.18)",
                }}
                className="relative z-0 flex w-full max-w-[380px] items-center gap-3 rounded-[var(--radius-panel)] px-5 py-4 hover:z-10"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold"
                  style={{ background: "var(--color-accent-muted)", color: "var(--color-accent-secondary)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] font-medium text-[var(--color-text-primary)]">{it}</span>
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.55} className="mt-10 sm:mt-16">
        <Bold>
          No solamente intercambiás tiempo por dinero. Tu capacidad de generar resultados también puede formar parte
          de tu compensación.
        </Bold>
      </Reveal>
    </Section>
  );
}

// ─────────────── 10 · Tenés algo propio ───────────────

function TieneAlgoPropio() {
  const items = ["Un emprendimiento", "Un servicio", "Una agencia", "Un producto", "Una marca personal", "Un infoproducto", "Una tienda", "Conocimientos que querés monetizar"];
  return (
    <Section>
      <Reveal>
        <Kicker>Esto no es solo para empleados</Kicker>
        <H>¿Y si ya tenés algo propio?</H>
        <Lead>Quizás tenés:</Lead>
      </Reveal>
      <div className="mt-6 flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it} className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary)]" style={{ background: "var(--color-bg-elevated-2)" }}>
            {it}
          </span>
        ))}
      </div>
      <Reveal delay={0.25}>
        <Bold>Pero no sabés vender de forma sistemática.</Bold>
      </Reveal>
      <Reveal delay={0.35}>
        <Lead>
          Entonces la habilidad comercial deja de ser solo una opción laboral — puede ser la herramienta con la que
          construís tu propio negocio.
        </Lead>
      </Reveal>
    </Section>
  );
}

// ─────────────── 11 · Una habilidad para toda la vida ───────────────

function HabilidadDeVida() {
  return (
    <Section>
      <Reveal>
        <Kicker>Una habilidad transversal</Kicker>
        <H>Vender no es solamente conseguir un trabajo</H>
      </Reveal>
      <List items={HABILIDAD_ITEMS} />
      <Reveal delay={0.5}>
        <Bold>
          Podés cambiar de empresa. Podés cambiar de industria. Incluso podés cambiar de profesión. Pero una habilidad
          comercial bien desarrollada puede acompañarte en todas esas etapas.
        </Bold>
      </Reveal>
    </Section>
  );
}

// ─────────────── 12 · No tenés que hacerlo solo ───────────────

function NoSolo() {
  const items = ["Personas", "Comunidad", "Contactos", "Referencias", "Acompañamiento", "Oportunidades"];
  return (
    <Section>
      <Reveal>
        <Kicker>No es solo aprender</Kicker>
        <H>Cambiar tu vida profesional también necesita compañía</H>
        <Lead>También necesitás:</Lead>
      </Reveal>

      {/* Cluster de círculos superpuestos: la sensación de "hay gente ahí",
          no una lista de palabras sueltas. */}
      <RevealGroup stagger={0.08} className="mt-10 flex flex-wrap items-center">
        {items.map((it, i) => (
          <RevealItem key={it}>
            <motion.div
              whileHover={{ y: -6, zIndex: 20 }}
              className="group relative flex flex-col items-center"
              style={{ marginLeft: i === 0 ? 0 : -18, zIndex: items.length - i }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-[13px] font-bold uppercase"
                style={{
                  background: "var(--color-accent-muted)",
                  color: "var(--color-accent-secondary)",
                  border: "3px solid var(--color-bg-base)",
                  boxShadow: "0 6px 16px -6px rgba(20,18,14,0.22)",
                }}
              >
                {it.slice(0, 2)}
              </span>
              <span className="pointer-events-none absolute -bottom-7 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--color-text-primary)", color: "var(--color-bg-base)" }}>
                {it}
              </span>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.25} className="mt-14">
        <Bold>
          A veces no necesitás que alguien te diga qué hacer. Necesitás una comunidad que te ayude a no abandonar
          cuando hacerlo solo se vuelve difícil.
        </Bold>
      </Reveal>
    </Section>
  );
}

// ─────────────── 13 · La decisión ───────────────

function Decision() {
  return (
    <section className="relative overflow-hidden border-t border-black/10 px-6 py-28 sm:px-8 sm:py-36">
      <Watermark text="ELEGÍ" className="top-6" />
      <div className="relative mx-auto max-w-[680px]">
        <Reveal>
          <Kicker>Dos caminos</Kicker>
          <H>Tenés dos opciones</H>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Reveal delay={0.1}>
            <TiltCard className="relative h-full overflow-hidden rounded-[var(--radius-panel)]">
              <div className="h-full p-7" style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-panel)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--color-text-muted)]">Opción 1</p>
                <p className="mt-3 text-[18px] font-semibold text-[var(--color-text-primary)]">Seguir exactamente como estás</p>
                <div className="mt-3 space-y-1 text-[14px] text-[var(--color-text-secondary)]">
                  <p>Mismo trabajo. Misma rutina.</p>
                  <p>Mismo ingreso. Mismos desplazamientos.</p>
                  <p>Misma dependencia. Misma incertidumbre.</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal delay={0.2}>
            <TiltCard className="relative h-full overflow-hidden rounded-[var(--radius-panel)]">
              <div className="h-full p-7" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-accent)", borderRadius: "var(--radius-panel)" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--color-accent-secondary)]">Opción 2</p>
                <p className="mt-3 text-[18px] font-semibold text-[var(--color-text-primary)]">Empezar a construir una alternativa</p>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                  No tenés que saber exactamente cómo va a terminar. Pero sí podés empezar.
                </p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────── 14 · El cambio no empieza renunciando ───────────────

function NoRenuncies() {
  const pasos = ["Seguís trabajando", "Desarrollás una nueva habilidad", "Explorás nuevas oportunidades", "Construís experiencia", "Generás evidencia", "Decidís tu siguiente movimiento"];
  return (
    <Section>
      <Reveal>
        <Kicker>Sin dar el salto todavía</Kicker>
        <H>No tenés que renunciar mañana</H>
        <Lead>Podés empezar mientras:</Lead>
      </Reveal>
      <div className="mt-8">
        {pasos.map((p, i) => (
          <Reveal key={p} delay={i * 0.07}>
            <div className="flex items-center gap-3 py-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                style={{
                  background: i === pasos.length - 1 ? "var(--color-accent)" : "var(--color-bg-elevated-2)",
                  color: i === pasos.length - 1 ? "#fff" : "var(--color-text-secondary)",
                }}
              >
                {i + 1}
              </span>
              <span className="text-[16px] text-[var(--color-text-primary)]" style={{ fontWeight: i === pasos.length - 1 ? 600 : 400 }}>
                {p}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─────────────── 15 + 16 · Cierre (mismo tratamiento oscuro que CTASection) ───────────────

function Cierre() {
  const items = [
    "Trabajar remotamente.",
    "Acceder a nuevos mercados.",
    "Desarrollar una habilidad comercial.",
    "Crear nuevas posibilidades de ingresos.",
    "Tener más control sobre tu tiempo.",
    "Construir una carrera que no dependa exclusivamente del lugar donde vivís.",
  ];
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0B0D] px-6 py-28 text-center sm:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "34px 34px" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[60rem] -translate-x-1/2 -translate-y-1/3 opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10">
        <Reveal>
          <Logo className="mx-auto h-9 w-9 text-[var(--color-accent)]" />
        </Reveal>
        <Reveal delay={0.1} className="mt-10 max-w-[720px]">
          <p className="text-[1.9rem] font-bold leading-[1.22] tracking-[-0.02em] text-white sm:text-[2.6rem]">
            Quizás no estás buscando otro trabajo.
            <br />
            <span className="font-serif-display italic font-normal text-[var(--color-accent)]">
              Quizás estás buscando otra forma de vivir tu vida profesional.
            </span>
          </p>
        </Reveal>
        <Reveal delay={0.22} className="mx-auto mt-9 max-w-[420px] space-y-2 text-[15px] leading-relaxed text-white/60">
          {items.map((it) => (
            <p key={it}>{it}</p>
          ))}
        </Reveal>
        <Reveal delay={0.36} className="mt-14">
          <p className="text-[17px] font-semibold text-white">No tenés que cambiar tu vida de un día para el otro.</p>
          <p className="text-[17px] font-semibold text-[var(--color-accent)]">Pero podés empezar ahora mismo.</p>
        </Reveal>
        <Reveal delay={0.48} className="mt-16 flex items-center justify-center gap-3">
          <Logo className="h-6 w-6 text-white/70" />
          <span className="text-[13px] font-semibold tracking-tight text-white/70">
            Instituto Latinoamericano de Formación Comercial
          </span>
        </Reveal>
      </div>
    </section>
  );
}
