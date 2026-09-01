// Avisa por Telegram cuando algo falla en un formulario. Nunca rompe el
// flujo principal: si el propio aviso falla, solo se loguea.
export async function alertFailure(context: string, detail: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `⚠️ ${context}\n\n${detail}`,
      }),
    });
  } catch (err) {
    console.error("No se pudo enviar la alerta de Telegram:", err);
  }
}
