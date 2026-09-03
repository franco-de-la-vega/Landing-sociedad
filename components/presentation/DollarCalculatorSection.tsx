import DollarCalculator from "./DollarCalculator";

// Cierre de la presentación y único lugar donde aparecen los precios: el lead
// elige su país y recién ahí se abren los 3 planes en su moneda + la
// calculadora de seña. Hasta que no elige, la página termina acá.
export default function DollarCalculatorSection() {
  return (
    <section
      id="precios"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <DollarCalculator />
      </div>
    </section>
  );
}
