import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gracias por tu compra — Instituto Latinoamericano de Formación Comercial",
  robots: { index: false, follow: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#0B0B0C] px-6 py-20">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <span
          aria-hidden
          className="mb-8 h-px w-10"
          style={{ backgroundColor: "#6B1E2B" }}
        />

        <h1 className="text-[2rem] font-semibold leading-[1.15] tracking-tight text-[#F5F1EC] sm:text-[2.4rem]">
          Gracias por tu compra
        </h1>

        {plan && (
          <p
            className="mt-5 text-[13px] font-medium uppercase tracking-[0.14em]"
            style={{ color: "#6B1E2B" }}
          >
            Plan {plan}
          </p>
        )}

        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#F5F1EC]/60">
          En breve te llega un mail con los próximos pasos.
        </p>
      </div>
    </main>
  );
}
