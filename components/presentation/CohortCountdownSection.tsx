import CohortCountdown from "./CohortCountdown";

export default function CohortCountdownSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-10 md:px-10 md:py-12">
      <CohortCountdown />
    </section>
  );
}
