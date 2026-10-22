const WHATSAPP_URL =
  "https://wa.me/5492617093210?text=" + encodeURIComponent("Hola, quiero información sobre el instituto.");

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] transition-all duration-300 hover:pr-5 sm:bottom-7 sm:right-7"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16.04 3C9.4 3 4 8.37 4 15c0 2.32.66 4.5 1.82 6.35L4 29l7.86-1.78A12.06 12.06 0 0 0 16.04 27C22.67 27 28 21.63 28 15S22.67 3 16.04 3Zm0 21.8c-1.86 0-3.6-.5-5.1-1.38l-.36-.21-4.66 1.06 1.08-4.5-.24-.38A9.7 9.7 0 0 1 6.3 15c0-5.38 4.37-9.76 9.74-9.76 5.36 0 9.7 4.38 9.7 9.76 0 5.37-4.34 9.8-9.7 9.8Zm5.34-7.3c-.3-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.37-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.45.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.51-.07-.15-.66-1.58-.9-2.16-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.2 3.01.14.2 2.06 3.14 5 4.4.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.73-.7 1.97-1.38.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-all duration-300 group-hover:max-w-[10rem]">
        Escribinos
      </span>
    </a>
  );
}
