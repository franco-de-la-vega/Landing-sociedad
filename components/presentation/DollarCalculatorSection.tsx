import DollarCalculator from "./DollarCalculator";

// Cierre de la presentación y único lugar donde aparecen los precios: los 3
// planes en USD + la calculadora de seña y cuotas.
export default function DollarCalculatorSection() {
  return (
    <section
      id="precios"
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-elevated-2)] px-6 py-14 md:px-12 md:py-16"
    >
      <div className="mx-auto max-w-[1320px]">
        <DollarCalculator />
      </div>
    </section>
  );
}
