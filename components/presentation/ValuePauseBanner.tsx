import Reveal from "@/components/Reveal";

export default function ValuePauseBanner() {
  return (
    <section className="relative border-t border-white/10 bg-[#08090a] px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-white md:text-[3rem]">
            Una competencia comercial puede convertirse en un activo
            profesional de alto valor cuando se desarrolla, demuestra y
            aplica en el mercado adecuado.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-zinc-400 md:text-[17px]">
            No te formamos para que sepas hablar de ventas. Te entrenamos
            para que puedas demostrar que sabés vender.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
