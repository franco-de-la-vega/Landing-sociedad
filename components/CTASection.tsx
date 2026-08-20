import Reveal from "./Reveal";
import MultiStepForm from "./MultiStepForm";

export default function CTASection() {
  return (
    <section id="aplicar" className="relative px-5 py-28 sm:px-8 sm:py-40">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Conocenos
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-7">
          <h2 className="text-metal text-[2.1rem] font-bold tracking-[-0.03em] sm:text-[3.2rem]">
            El primer paso es conocerte a vos.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-lg text-[15px] leading-relaxed text-text-secondary">
            Cuatro preguntas breves para entender dónde estás parado hoy.
            No hay respuestas correctas o incorrectas: el objetivo es
            ubicarte en el punto de partida que te corresponde.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 w-full">
          <MultiStepForm />
        </Reveal>
      </div>
    </section>
  );
}
