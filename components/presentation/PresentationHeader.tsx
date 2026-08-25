import Logo from "@/components/Logo";

export default function PresentationHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C0E]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4 md:px-10">
        <Logo className="h-8 w-8 shrink-0 text-accent sm:h-9 sm:w-9" />
        <span className="text-[16px] font-semibold leading-tight tracking-tight text-white sm:text-[19px]">
          Instituto Latinoamericano de Formación Comercial
        </span>
      </div>
    </header>
  );
}
