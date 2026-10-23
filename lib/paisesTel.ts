/**
 * Países para el WhatsApp del formulario: código, bandera y cuántos dígitos tiene el número LOCAL
 * (sin el 0 inicial, sin el 15 y sin el código de país). Argentina es el predeterminado.
 */
export type PaisTel = { id: string; nombre: string; bandera: string; codigo: string; min: number; max: number; ejemplo: string; mobil9?: boolean };

export const PAISES_TEL: PaisTel[] = [
  { id: "AR", nombre: "Argentina", bandera: "🇦🇷", codigo: "54", min: 10, max: 10, ejemplo: "2615336300", mobil9: true },
  { id: "UY", nombre: "Uruguay", bandera: "🇺🇾", codigo: "598", min: 8, max: 8, ejemplo: "94618106" },
  { id: "CL", nombre: "Chile", bandera: "🇨🇱", codigo: "56", min: 9, max: 9, ejemplo: "912345678" },
  { id: "CO", nombre: "Colombia", bandera: "🇨🇴", codigo: "57", min: 10, max: 10, ejemplo: "3012345678" },
  { id: "MX", nombre: "México", bandera: "🇲🇽", codigo: "52", min: 10, max: 10, ejemplo: "5512345678" },
  { id: "PE", nombre: "Perú", bandera: "🇵🇪", codigo: "51", min: 9, max: 9, ejemplo: "912345678" },
  { id: "BO", nombre: "Bolivia", bandera: "🇧🇴", codigo: "591", min: 8, max: 8, ejemplo: "71234567" },
  { id: "PY", nombre: "Paraguay", bandera: "🇵🇾", codigo: "595", min: 9, max: 9, ejemplo: "981234567" },
  { id: "EC", nombre: "Ecuador", bandera: "🇪🇨", codigo: "593", min: 9, max: 9, ejemplo: "991234567" },
  { id: "VE", nombre: "Venezuela", bandera: "🇻🇪", codigo: "58", min: 10, max: 10, ejemplo: "4121234567" },
  { id: "CR", nombre: "Costa Rica", bandera: "🇨🇷", codigo: "506", min: 8, max: 8, ejemplo: "83123456" },
  { id: "PA", nombre: "Panamá", bandera: "🇵🇦", codigo: "507", min: 8, max: 8, ejemplo: "61234567" },
  { id: "GT", nombre: "Guatemala", bandera: "🇬🇹", codigo: "502", min: 8, max: 8, ejemplo: "51234567" },
  { id: "DO", nombre: "Rep. Dominicana", bandera: "🇩🇴", codigo: "1", min: 10, max: 10, ejemplo: "8091234567" },
  { id: "BR", nombre: "Brasil", bandera: "🇧🇷", codigo: "55", min: 10, max: 11, ejemplo: "11912345678" },
  { id: "ES", nombre: "España", bandera: "🇪🇸", codigo: "34", min: 9, max: 9, ejemplo: "612345678" },
  { id: "US", nombre: "Estados Unidos", bandera: "🇺🇸", codigo: "1", min: 10, max: 10, ejemplo: "3051234567" },
  { id: "OT", nombre: "Otro país", bandera: "🌎", codigo: "", min: 7, max: 12, ejemplo: "" },
];

/** Deja solo los dígitos y saca el 0 inicial (0261…) y el 15 de las líneas argentinas. */
export function limpiarLocal(pais: PaisTel, local: string): string {
  let d = local.replace(/\D/g, "");
  if (pais.id === "OT") return d;
  d = d.replace(/^0+/, "");
  if (pais.id === "AR") {
    if (d.startsWith("549")) d = d.slice(3);
    else if (d.startsWith("54")) d = d.slice(2);
    // 0261 15 5336300 → después de sacar el 0 queda 261155336300: se quita el "15" tras el código de área (2, 3 o 4 dígitos)
    if (d.length === 12 || d.length === 11) {
      for (const area of [2, 3, 4]) {
        if (d.slice(area, area + 2) === "15" && d.length - 2 === 10) { d = d.slice(0, area) + d.slice(area + 2); break; }
      }
    }
  }
  if (pais.id === "UY" && d.length === 9 && d.startsWith("9")) d = d.slice(0);
  return d;
}

export function telefonoLocalValido(pais: PaisTel, local: string): boolean {
  const d = limpiarLocal(pais, local);
  return d.length >= pais.min && d.length <= pais.max;
}

/** Número final para guardar: "+54 9 2615336300" (Argentina lleva el 9 de celular), "+598 94618106", etc. */
export function armarTelefono(pais: PaisTel, local: string, codigoOtro = ""): string {
  const d = limpiarLocal(pais, local);
  if (!d) return "";
  const codigo = pais.id === "OT" ? codigoOtro.replace(/\D/g, "") : pais.codigo;
  if (!codigo) return "";
  return `+${codigo}${pais.mobil9 ? " 9" : ""} ${d}`;
}
