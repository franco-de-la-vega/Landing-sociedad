// Puntúa un lead del formulario general según lo que respondió, para que el
// equipo priorice a quién llamar primero. Es una heurística simple por
// palabras clave sobre texto libre: no es ciencia exacta, pero ordena la
// lista de "a quién le escribo primero" sin que nadie tenga que leer las
// 4 respuestas de cada lead a mano.

type LeadAnswers = {
  situacion: string;
  experiencia: string;
  busqueda: string;
  disponibilidad: string;
};

const VENTAS_KEYWORDS = [
  "venta",
  "vendo",
  "vendí",
  "vendedor",
  "closer",
  "call center",
  "telemarketing",
  "comercial",
  "atención al cliente",
  "atencion al cliente",
];
const REMOTO_KEYWORDS = ["remoto", "online", "casa"];
const DISPONIBILIDAD_ALTA = [
  "completo",
  "full time",
  "full-time",
  "todo el día",
  "todo el dia",
  "mañana y tarde",
  "tiempo completo",
];
const DISPONIBILIDAD_BAJA = ["poco tiempo", "part time", "part-time", "medio día", "medio dia", "estudiando"];
const URGENCIA_KEYWORDS = [
  "urgente",
  "necesito",
  "sin trabajo",
  "desempleado",
  "busco cambio",
  "quiero cambiar",
  "me quedé sin",
  "me quede sin",
];
const OBJETIVO_KEYWORDS = [
  "ingreso estable",
  "cambio de rubro",
  "remoto en serio",
  "independencia",
  "libertad financiera",
  "mejor sueldo",
];

const NEGATION_WORDS = ["nunca", "jamás", "jamas", "no tengo", "sin experiencia", "no ", "ninguna"];

// Evita falsos positivos tipo "Nunca vendí" (contiene "vendí" igual que
// "Vendí seguros 2 años", pero significa lo contrario). Si hay una palabra
// de negación en los ~20 caracteres antes del match, no cuenta el punto.
function includesAny(text: string, keywords: string[]) {
  const t = text.toLowerCase();
  return keywords.some((k) => {
    const idx = t.indexOf(k);
    if (idx === -1) return false;
    const before = t.slice(Math.max(0, idx - 20), idx);
    const negated = NEGATION_WORDS.some((n) => before.includes(n));
    return !negated;
  });
}

export function scoreLead(a: LeadAnswers): "Caliente" | "Tibio" | "Frío" {
  let score = 0;
  if (includesAny(a.experiencia, VENTAS_KEYWORDS)) score += 2;
  if (includesAny(a.experiencia, REMOTO_KEYWORDS)) score += 1;
  if (includesAny(a.disponibilidad, DISPONIBILIDAD_ALTA)) score += 2;
  if (includesAny(a.disponibilidad, DISPONIBILIDAD_BAJA)) score -= 1;
  if (includesAny(a.situacion, URGENCIA_KEYWORDS)) score += 1;
  if (includesAny(a.busqueda, OBJETIVO_KEYWORDS)) score += 1;

  if (score >= 3) return "Caliente";
  if (score >= 1) return "Tibio";
  return "Frío";
}
