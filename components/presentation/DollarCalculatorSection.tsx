import DollarCalculator from "./DollarCalculator";

// Última pantalla de la presentación: calculadora en vivo del dólar,
// para el momento de negociar el pago con el lead.
export default function DollarCalculatorSection() {
  return (
    <section id="calculadora" className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <DollarCalculator />
      </div>
    </section>
  );
}
