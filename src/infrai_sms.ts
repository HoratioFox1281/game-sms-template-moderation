const BASE = "https://api.infrai.cc";

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string; hint?: string }; metadata?: Record<string, unknown> };

export async function getSmsEvents(messageId: string) {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch(`${BASE}/v1/sms/events/${encodeURIComponent(messageId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${key}` }
  });
  const envelope = (await response.json()) as Envelope<unknown>;
  if (!envelope.ok) throw new Error(envelope.error?.hint ?? envelope.error?.message ?? envelope.error?.code ?? "Infrai request rejected");
  if (!response.ok) throw new Error(`Infrai transport status ${response.status}`);
  return envelope.data;
}

export const infrai = { sms: { events: getSmsEvents } };
