import { notFound } from "next/navigation";
import CheckoutDlocal from "./CheckoutDlocal";

/**
 * Página de pago dedicada por plan — el botón "Pagar ahora" de /presentacion
 * abre esto en pestaña nueva. Existe porque el "Botón de pago" de dLocal Go
 * es solo un script embebido (no da una URL propia), y el closer no puede
 * gestionar el checkout de otra persona en la misma pestaña de la landing.
 * Snippets pegados tal cual los generó dLocal (Franco, 2026-09-10).
 */
const PLANES: Record<string, { nombre: string; monto: string; snippet: string }> = {
  junior: {
    nombre: "Comercial Junior",
    monto: "US$397",
    snippet: `<script data-reference-id="81b2f02b-a335-45d2-a341-5ae1069a7b3d">(function(){const z=!!window.DlocalGo,s=z?document.querySelector('script[src="https://static.dlocalgo.com/dlocalgo.min.js"]'):document.createElement("script");z||(s.src="https://static.dlocalgo.com/dlocalgo.min.js",s.async=!0,document.body.appendChild(s));s.addEventListener("load",()=>{const e=document.querySelector('script[data-reference-id="81b2f02b-a335-45d2-a341-5ae1069a7b3d"]'),t=e.parentNode,n="dp-btn-81b2f02b-a335-45d2-a341-5ae1069a7b3d",c=document.createElement("div");c.id=n,t.insertBefore(c,e);new DlocalGo("tOGnvMhyDfKcqEZDTGQFvyVnzIFwrfTd").createCheckout(n,{subType:"BUTTON",country:"",currency:"USD",amount:"397",lang:"",text:"LO QUIERO"})});})()</script>`,
  },
  "high-ticket": {
    nombre: "Comercial High Ticket",
    monto: "US$497",
    snippet: `<script data-reference-id="86e46b2f-f99a-43a2-bad1-f6efce8802f2">(function(){const z=!!window.DlocalGo,s=z?document.querySelector('script[src="https://static.dlocalgo.com/dlocalgo.min.js"]'):document.createElement("script");z||(s.src="https://static.dlocalgo.com/dlocalgo.min.js",s.async=!0,document.body.appendChild(s));s.addEventListener("load",()=>{const e=document.querySelector('script[data-reference-id="86e46b2f-f99a-43a2-bad1-f6efce8802f2"]'),t=e.parentNode,n="dp-btn-86e46b2f-f99a-43a2-bad1-f6efce8802f2",c=document.createElement("div");c.id=n,t.insertBefore(c,e);new DlocalGo("tOGnvMhyDfKcqEZDTGQFvyVnzIFwrfTd").createCheckout(n,{subType:"BUTTON",country:"",currency:"USD",amount:"497",lang:"",text:"LO QUIERO"})});})()</script>`,
  },
  carrera: {
    nombre: "Carrera Completa",
    monto: "US$1429",
    snippet: `<script data-reference-id="d3326b7f-78b1-42fe-ae8b-60057c31bfcb">(function(){const z=!!window.DlocalGo,s=z?document.querySelector('script[src="https://static.dlocalgo.com/dlocalgo.min.js"]'):document.createElement("script");z||(s.src="https://static.dlocalgo.com/dlocalgo.min.js",s.async=!0,document.body.appendChild(s));s.addEventListener("load",()=>{const e=document.querySelector('script[data-reference-id="d3326b7f-78b1-42fe-ae8b-60057c31bfcb"]'),t=e.parentNode,n="dp-btn-d3326b7f-78b1-42fe-ae8b-60057c31bfcb",c=document.createElement("div");c.id=n,t.insertBefore(c,e);new DlocalGo("tOGnvMhyDfKcqEZDTGQFvyVnzIFwrfTd").createCheckout(n,{subType:"BUTTON",country:"",currency:"USD",amount:"1429",lang:"",text:"LO QUIERO"})});})()</script>`,
  },
};

export default async function PagarPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  const data = PLANES[plan];
  if (!data) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0c0e] px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-10 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        <img src="/icon.png" alt="" className="mx-auto h-10 w-10 rounded-full" />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b8935a]">Instituto Latinoamericano de Formación Comercial</p>
        <h1 className="mt-3 text-[26px] font-black tracking-tight text-white">{data.nombre}</h1>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Total a pagar</p>
          <p className="mt-1 text-[30px] font-black tracking-tight text-white">{data.monto}</p>
        </div>

        <p className="mt-6 text-[12.5px] leading-relaxed text-white/50">
          Pagás con tu tarjeta en el siguiente paso. Esta pestaña es solo tuya.
        </p>

        <div className="mt-7">
          <CheckoutDlocal snippet={data.snippet} />
        </div>
      </div>
    </div>
  );
}
