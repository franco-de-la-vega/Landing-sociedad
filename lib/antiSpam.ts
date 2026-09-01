// Frenos livianos contra spam/bots en los formularios públicos, sin agregar
// infraestructura nueva (sin captcha, sin base de datos aparte).

const NOTION_VERSION = "2022-06-28";

// Honeypot: un campo invisible para personas pero que los bots de
// autocompletado suelen llenar igual. Si viene con algo, es spam.
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

// Evita duplicados por doble click o reenvíos en ráfaga del mismo número:
// busca si ya se creó una página con ese WhatsApp en esta database en los
// últimos `windowMinutes` minutos. No hace falta que la database tenga una
// columna de fecha propia: se filtra por el timestamp de creación de la
// página, que Notion siempre tiene.
export async function hasRecentDuplicate(
  notionToken: string,
  databaseId: string,
  whatsappPropertyName: string,
  whatsapp: string,
  windowMinutes = 30
): Promise<boolean> {
  const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        and: [
          { property: whatsappPropertyName, phone_number: { equals: whatsapp } },
          { timestamp: "created_time", created_time: { on_or_after: cutoff } },
        ],
      },
      page_size: 1,
    }),
  });

  if (!res.ok) return false; // si falla la chequeada, no bloqueamos el envío real
  const data = await res.json();
  return (data.results || []).length > 0;
}
