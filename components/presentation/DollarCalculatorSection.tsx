import DollarCalculator from "./DollarCalculator";

// Cierre de la presentación: los 3 planes con precio fijo en USD, y debajo
// una calculadora de seña/cuotas (también en USD, sin conversión de moneda).
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
