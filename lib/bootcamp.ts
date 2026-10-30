/*
  CONTENIDO DE LA GUÍA DEL BOOTCAMP (Evidencia 05).
  Única fuente: para actualizar la página se edita solo este archivo.
  Solo van componentes confirmados por el instituto, con su alcance real.
  Para sumar uno nuevo (laboratorios, Sparring Comercial, sesiones 1:1), agregar
  un objeto a COMPONENTES con el alcance validado.
*/

export const REMINDER = "El diagnóstico decide qué presentar. Selecciona lo que tiene sentido para esa persona.";

export const DESCRIPCION = {
  titulo: "Formación comercial remota, con práctica real.",
  que: "Programa online del Instituto Latinoamericano de Formación Comercial para profesionalizarse en negociación y desarrollo comercial.",
  paraQuien: "Para personas de toda Latinoamérica que quieren trabajar como representantes comerciales remotos. No se necesita experiencia previa.",
  competencias: ["Negociación", "Desarrollo comercial", "Práctica en simulaciones", "Uso de un CRM real"],
};

export type Componente = {
  id: string;
  icono: "radio" | "campus" | "roleplay" | "crm" | "feedback" | "certificacion";
  nombre: string;
  caracteristica: string;
  beneficio: string;
  aplicacion: string;
};

export const COMPONENTES: Componente[] = [
  {
    id: "clases",
    icono: "radio",
    nombre: "Clases en vivo",
    caracteristica: "Dos clases en vivo por semana con formadores activos en el mercado.",
    beneficio: "Permite preguntar y recibir respuesta en el momento, en lugar de depender de videos grabados.",
    aplicacion: "Cada semana se asiste a las clases en vivo y se avanza en el campus a ritmo propio entre una clase y otra.",
  },
  {
    id: "campus",
    icono: "campus",
    nombre: "Campus",
    caracteristica: "Plataforma propia con la ruta de 14 sprints, cada uno con un proyecto. Un sprint se desbloquea al completar el anterior.",
    beneficio: "Permite ver en qué sprint se está, cuánto se avanzó y qué sigue, todo en un solo lugar.",
    aplicacion: "Se usa para estudiar, practicar y hacer seguimiento del progreso sin salir de la plataforma.",
  },
  {
    id: "roleplays",
    icono: "roleplay",
    nombre: "Roleplays y simulaciones",
    caracteristica: "Simulaciones y roleplays de escenarios comerciales dentro de la formación.",
    beneficio: "Permite ensayar una situación, recibir feedback y corregir antes de enfrentarla de verdad.",
    aplicacion: "Se practica en los encuentros y se repite hasta que la técnica sale natural.",
  },
  {
    id: "crm",
    icono: "crm",
    nombre: "CRM real",
    caracteristica: "Herramienta que usa un equipo comercial de verdad, incluida en la formación.",
    beneficio: "Permite aprender con la misma herramienta con la que se trabaja en el mercado.",
    aplicacion: "Se usa en la práctica para registrar y seguir un proceso comercial, desde el contacto hasta el cierre.",
  },
  {
    id: "feedback",
    icono: "feedback",
    nombre: "Feedback y acompañamiento",
    caracteristica: "Seguimiento y feedback durante toda la formación, con medición del desempeño.",
    beneficio: "Permite saber en qué se está fallando y trabajar sobre esas brechas, sin avanzar solo.",
    aplicacion: "Después de practicar se recibe devolución, se identifica qué mejorar y se vuelve a intentar.",
  },
  {
    id: "certificacion",
    icono: "certificacion",
    nombre: "Certificación y portafolio",
    caracteristica: "Cada etapa cierra con un proyecto. Al terminar se obtiene la certificación y un portafolio de evidencias.",
    beneficio: "Permite demostrar con hechos lo que se sabe hacer.",
    aplicacion: "Los proyectos de cada sprint se acumulan en el portafolio a lo largo de la formación.",
  },
];

export const RECORRIDO = [
  { titulo: "Clases", texto: "Dos clases en vivo por semana." },
  { titulo: "Práctica", texto: "Simulaciones y roleplays en los encuentros." },
  { titulo: "Proyecto", texto: "Cada sprint cierra con un proyecto." },
  { titulo: "Feedback", texto: "Devolución sobre el desempeño." },
  { titulo: "Acompañamiento", texto: "Seguimiento de principio a fin." },
  { titulo: "Certificación", texto: "Cierre con certificado y portafolio." },
];

export const SECUENCIA = [
  { titulo: "Característica", texto: "Qué incluye el programa, dicho simple." },
  { titulo: "Beneficio", texto: "Qué le permite hacer a esa persona." },
  { titulo: "Impacto", texto: "Qué cambia en su situación. Se arma con lo que contó en el diagnóstico." },
  { titulo: "Confirmación", texto: "Preguntar si eso le hace sentido a ella o a él." },
];

export const EJEMPLO = {
  caracteristica: "Roleplays",
  beneficio: "Permiten ensayar, recibir feedback y corregir.",
  impacto: "Para alguien que teme quedarse solo con teoría, esa práctica puede ayudarle a prepararse antes de situaciones reales.",
  confirmacion: "¿Esa práctica es lo que te hacía falta?",
};

/* Qué le preocupa o busca el prospecto, y qué componentes conviene mostrar en ese caso. */
export const DIAGNOSTICOS = [
  {
    id: "teoria",
    titulo: "Teme quedarse solo con teoría",
    sugerencia: "Mostrá la práctica: roleplays para ensayar, recibir feedback y corregir.",
    componentes: ["roleplays", "clases"],
  },
  {
    id: "solo",
    titulo: "Teme avanzar solo",
    sugerencia: "Mostrá el seguimiento: feedback y acompañamiento, con la ruta visible en el campus.",
    componentes: ["feedback", "campus"],
  },
  {
    id: "demostrar",
    titulo: "Quiere demostrar lo que sabe",
    sugerencia: "Mostrá el cierre de cada etapa: proyectos, portafolio y certificación.",
    componentes: ["certificacion", "campus"],
  },
  {
    id: "mercado",
    titulo: "Quiere aprender con herramientas del mercado",
    sugerencia: "Mostrá el CRM real y las clases con formadores activos en el mercado.",
    componentes: ["crm", "clases"],
  },
];
