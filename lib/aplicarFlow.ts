/**
 * COMPARTIDO (cliente + servidor). Árbol de preguntas del filtro /aplicar.
 * Define QUÉ se pregunta y en qué orden según lo que la persona va contestando.
 * NO define quién califica: eso vive solo en el servidor (aplicarEvaluar.ts),
 * así el navegador nunca sabe qué respuesta descarta.
 */

export type Resp = Record<string, string>;

export type Pregunta = {
  id: string;
  titulo: string;
  ayuda?: string;
  /** Si tiene opciones es de selección; si no, es texto libre. */
  opciones?: string[];
  /** Mínimo de caracteres (solo texto libre). */
  min?: number;
  placeholder?: string;
};

// Opciones que la lógica necesita reconocer (la evaluación las usa también).
export const O = {
  busca: {
    formar: "Formarme para trabajar de forma remota en el área comercial",
    trabajo: "Que me consigan un trabajo ya",
    nose: "Todavía no sé, quiero ver de qué se trata",
  },
  situacion: {
    sinTrabajo: "Estoy sin trabajo",
    dependencia: "Trabajo en relación de dependencia",
    independiente: "Soy independiente o emprendedor",
    estudio: "Estudio",
  },
  intento: {
    nunca: "Nunca lo intenté",
    cuenta: "Lo intenté por mi cuenta",
    curso: "Lo intenté con un curso o formación",
    ahora: "Lo estoy intentando ahora",
  },
  depObj: {
    reemplazar: "Reemplazar mi trabajo actual",
    sumar: "Sumarlo a lo que ya hago",
  },
  horas: {
    menos3: "Menos de 3 horas",
    tres5: "Entre 3 y 5 horas",
    cinco10: "Entre 5 y 10 horas",
    mas10: "Más de 10 horas",
  },
  inversion: {
    ahora: "Puedo invertir ahora",
    organizar: "Tendría que organizarme, pero quiero hacerlo",
    no: "Hoy no puedo invertir",
  },
  cuando: {
    ya: "Lo antes posible",
    tres: "En 1 a 3 meses",
    masAdelante: "Más adelante",
  },
  tiempoBusca: {
    poco: "Lo empecé a pensar hace poco",
    meses: "Hace unos meses",
    anio: "Hace más de un año",
  },
} as const;

const P: Record<string, Pregunta> = {
  busca: {
    id: "busca",
    titulo: "¿Qué estás buscando?",
    opciones: [O.busca.formar, O.busca.trabajo, O.busca.nose],
  },
  situacion: {
    id: "situacion",
    titulo: "¿Cuál es tu situación hoy?",
    opciones: [O.situacion.sinTrabajo, O.situacion.dependencia, O.situacion.independiente, O.situacion.estudio],
  },

  // — sin trabajo —
  des_tiempo: {
    id: "des_tiempo",
    titulo: "¿Hace cuánto estás en esa situación?",
    opciones: ["Menos de 3 meses", "Entre 3 y 12 meses", "Más de un año"],
  },
  des_hizo: {
    id: "des_hizo",
    titulo: "¿Qué hiciste hasta ahora para salir de ahí y qué resultado tuviste?",
    ayuda: "Contanos tu historia: qué probaste, cuánto tiempo y qué pasó.",
    min: 100,
    placeholder: "Por ejemplo: hace 4 meses me quedé sin trabajo, me postulé a…",
  },
  des_ahora: {
    id: "des_ahora",
    titulo: "¿Por qué pensás que este es el momento indicado para formarte?",
    ayuda: "Qué cambió o qué te hizo decidir hoy.",
    min: 70,
    placeholder: "Escribilo con tus palabras",
  },

  // — relación de dependencia —
  dep_hoy: {
    id: "dep_hoy",
    titulo: "Contanos qué hacés hoy y qué es lo que no te convence de tu situación actual.",
    min: 100,
    placeholder: "Por ejemplo: trabajo como… hace X años y lo que me pesa es…",
  },
  dep_obj: {
    id: "dep_obj",
    titulo: "¿Qué buscás con el trabajo remoto?",
    opciones: [O.depObj.reemplazar, O.depObj.sumar],
  },
  dep_reemp: {
    id: "dep_reemp",
    titulo: "¿En cuánto tiempo te gustaría hacer ese cambio y qué necesitás para lograrlo?",
    min: 70,
    placeholder: "Contanos tu plan, aunque todavía no esté del todo claro",
  },

  // — independiente —
  ind_hoy: {
    id: "ind_hoy",
    titulo: "¿A qué te dedicás y cómo te está yendo hoy?",
    ayuda: "Sé específico: qué hacés, hace cuánto y cómo son tus resultados.",
    min: 100,
    placeholder: "Por ejemplo: tengo un negocio de… hace 2 años, facturo…",
  },
  ind_porque: {
    id: "ind_porque",
    titulo: "¿Por qué querés sumar el trabajo remoto en el área comercial?",
    min: 70,
    placeholder: "Escribilo con tus palabras",
  },

  // — estudia —
  est_que: {
    id: "est_que",
    titulo: "¿Qué estudiás y cuándo terminás?",
    min: 70,
    placeholder: "Carrera o curso, año en el que vas y fecha estimada de fin",
  },
  est_porque: {
    id: "est_porque",
    titulo: "¿Por qué querés empezar a trabajar de forma remota ahora y no cuando termines?",
    min: 70,
    placeholder: "Escribilo con tus palabras",
  },

  // — común —
  intento: {
    id: "intento",
    titulo: "¿Ya intentaste trabajar de forma remota?",
    opciones: [O.intento.nunca, O.intento.cuenta, O.intento.curso, O.intento.ahora],
  },
  int_cuenta: {
    id: "int_cuenta",
    titulo: "Contanos qué hiciste y cómo te fue. ¿Qué salió mal?",
    ayuda: "Cuanto más detalle, mejor: dónde buscaste, cuánto tiempo, qué respuestas tuviste.",
    min: 100,
    placeholder: "Por ejemplo: me postulé en LinkedIn durante 3 meses, hice un curso de…",
  },
  int_nunca: {
    id: "int_nunca",
    titulo: "¿Qué fue lo que te frenó hasta ahora?",
    min: 70,
    placeholder: "Escribilo con tus palabras",
  },
  tiempo_busca: {
    id: "tiempo_busca",
    titulo: "¿Hace cuánto querés trabajar de forma remota?",
    opciones: [O.tiempoBusca.poco, O.tiempoBusca.meses, O.tiempoBusca.anio],
  },
  horas: {
    id: "horas",
    titulo: "¿Cuántas horas por semana le podés dedicar a formarte?",
    opciones: [O.horas.menos3, O.horas.tres5, O.horas.cinco10, O.horas.mas10],
  },
  hor_org: {
    id: "hor_org",
    titulo: "La formación es intensiva y exige más horas. ¿Cómo harías para organizarte?",
    min: 70,
    placeholder: "Contanos cómo es tu semana y de dónde sacarías el tiempo",
  },
  inversion: {
    id: "inversion",
    titulo: "La formación requiere invertir tiempo y dinero. ¿En qué situación estás?",
    opciones: [O.inversion.ahora, O.inversion.organizar, O.inversion.no],
  },
  inv_org: {
    id: "inv_org",
    titulo: "¿Qué necesitarías resolver y en cuánto tiempo podrías hacerlo?",
    min: 70,
    placeholder: "Sé sincero: eso nos ayuda a orientarte mejor en la llamada",
  },
  cuando: {
    id: "cuando",
    titulo: "¿Cuándo te gustaría empezar?",
    opciones: [O.cuando.ya, O.cuando.tres, O.cuando.masAdelante],
  },
  meta: {
    id: "meta",
    titulo: "Si dentro de 6 meses esto te sale bien, ¿cómo se ve tu vida?",
    ayuda: "Última pregunta. Contanos con tus palabras qué querés lograr.",
    min: 100,
    placeholder: "Escribilo como si se lo contaras a un amigo",
  },
};

/** Lista ordenada de preguntas que le corresponden a ESTAS respuestas. */
export function visibles(r: Resp): Pregunta[] {
  const ids: string[] = ["busca", "situacion"];

  switch (r.situacion) {
    case O.situacion.sinTrabajo:
      ids.push("des_tiempo", "des_hizo", "des_ahora");
      break;
    case O.situacion.dependencia:
      ids.push("dep_hoy", "dep_obj");
      if (r.dep_obj === O.depObj.reemplazar) ids.push("dep_reemp");
      break;
    case O.situacion.independiente:
      ids.push("ind_hoy", "ind_porque");
      break;
    case O.situacion.estudio:
      ids.push("est_que", "est_porque");
      break;
  }

  ids.push("intento");
  if (r.intento) ids.push(r.intento === O.intento.nunca ? "int_nunca" : "int_cuenta");

  ids.push("tiempo_busca", "horas");
  if (r.horas === O.horas.menos3) ids.push("hor_org");

  ids.push("inversion");
  if (r.inversion === O.inversion.organizar) ids.push("inv_org");

  ids.push("cuando", "meta");
  return ids.map((id) => P[id]);
}

/** Texto con contenido real: largo, palabras variadas, sin "aaaaaa" ni "asdasd". */
export function textoValido(texto: string | undefined, min: number): boolean {
  const t = (texto ?? "").trim().replace(/\s+/g, " ");
  if (t.length < min) return false;
  const palabras = t.toLowerCase().split(" ").filter(Boolean);
  if (palabras.length < Math.ceil(min / 12)) return false;
  if (new Set(palabras).size < palabras.length * 0.5) return false;
  if (/(.)\1{5,}/.test(t)) return false;
  const letras = (t.match(/[a-záéíóúüñ]/gi) ?? []).length;
  return letras / t.length >= 0.7;
}

export function respuestaCompleta(p: Pregunta, valor: string | undefined): boolean {
  if (p.opciones) return Boolean(valor && p.opciones.includes(valor));
  return textoValido(valor, p.min ?? 0);
}

/** Todas las preguntas que le tocan están respondidas con contenido real. */
export function flujoCompleto(r: Resp): boolean {
  return visibles(r).every((p) => respuestaCompleta(p, r[p.id]));
}

/** Resumen legible (solo lo que le tocó) para dejar en las notas del lead. */
export function resumenRespuestas(r: Resp): string {
  return visibles(r)
    .map((p) => `• ${p.titulo}\n  ${(r[p.id] ?? "").trim()}`)
    .join("\n");
}

export const esWhatsappValido = (v: string) => v.replace(/[^0-9]/g, "").length >= 8;
export const esEmailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Etiquetas cortas para la ficha del CRM. */
const ETIQUETA: Record<string, string> = {
  busca: "Busca",
  situacion: "Situación",
  des_tiempo: "Hace cuánto sin trabajo",
  des_hizo: "Qué hizo hasta ahora",
  des_ahora: "Por qué ahora",
  dep_hoy: "Qué hace hoy y qué no le convence",
  dep_obj: "Qué busca con lo remoto",
  dep_reemp: "Plan para el cambio",
  ind_hoy: "A qué se dedica y cómo le va",
  ind_porque: "Por qué quiere sumar lo remoto",
  est_que: "Qué estudia y cuándo termina",
  est_porque: "Por qué empezar ahora",
  intento: "Ya intentó trabajar remoto",
  int_cuenta: "Qué hizo y cómo le fue",
  int_nunca: "Qué lo frenó hasta ahora",
  tiempo_busca: "Hace cuánto quiere trabajar remoto",
  horas: "Horas por semana",
  hor_org: "Cómo se organizaría",
  inversion: "Inversión",
  inv_org: "Qué necesitaría resolver",
  cuando: "Cuándo quiere empezar",
  meta: "Cómo se ve en 6 meses",
};

/**
 * Reparte las respuestas en los 3 campos de la ficha del CRM
 * ("A qué se dedica" / "Por qué le interesa" / "Disponibilidad"), todas con su etiqueta.
 */
export function camposCrm(r: Resp): { situacion: string; que_busca: string; disponibilidad: string } {
  const grupos = {
    situacion: ["situacion", "des_tiempo", "des_hizo", "des_ahora", "dep_hoy", "dep_obj", "dep_reemp", "ind_hoy", "ind_porque", "est_que", "est_porque"],
    que_busca: ["busca", "intento", "int_cuenta", "int_nunca", "tiempo_busca", "meta"],
    disponibilidad: ["horas", "hor_org", "inversion", "inv_org", "cuando"],
  };
  const hay = new Set(visibles(r).map((q) => q.id));
  const armar = (ids: string[]) =>
    ids
      .filter((id) => hay.has(id) && r[id]?.trim())
      .map((id) => `${ETIQUETA[id]}: ${r[id].trim()}`)
      .join("\n");
  return { situacion: armar(grupos.situacion), que_busca: armar(grupos.que_busca), disponibilidad: armar(grupos.disponibilidad) };
}
