// Manda un mensaje por Telegram. Nunca rompe el flujo principal: si el
// propio envío falla, solo se loguea.
async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error("No se pudo enviar el mensaje de Telegram:", err);
  }
}

// Avisa por Telegram cuando algo falla en un formulario.
export async function alertFailure(context: string, detail: string) {
  await sendTelegram(`⚠️ ${context}\n\n${detail}`);
}

// Avisa por Telegram cuando llega un mensaje nuevo (no es un error, es
// contenido real que alguien tiene que leer y responder).
export async function notify(context: string, detail: string) {
  await sendTelegram(`📩 ${context}\n\n${detail}`);
}
