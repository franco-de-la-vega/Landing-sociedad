import Reveal from "@/components/Reveal";

export default function ValuePauseBanner() {
  return (
    <section className="relative border-t border-white/10 bg-[#08090a] px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-white md:text-[3rem]">
            La habilidad comercial no es un gasto, es el activo con
            mayor retorno sobre la inversión del mercado actual.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-zinc-400 md:text-[17px]">
            Una vez que dominás la infraestructura de cierre, el mercado
            en moneda dura se vuelve accesible y repetible.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
