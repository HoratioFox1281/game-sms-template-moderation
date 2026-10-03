import { z } from "zod";
import { infrai } from "./infrai_sms.js";

const TemplateInput = z.object({
  name: z.string().min(1),
  signature: z.string().min(2),
  body: z.string().min(1),
  variables: z.array(z.string()).default([])
});

export type SmsTemplate = z.infer<typeof TemplateInput> & { status: "approved" | "pending" };
export type ModerationItem = { playerId: string; text: string; reason: "template-change" | "player-report"; status: "queued" | "reviewed" };

export class GameSmsService {
  private templates = new Map<string, SmsTemplate>();
  private queue: ModerationItem[] = [];

  approveTemplate(input: unknown): SmsTemplate {
    const parsed = TemplateInput.parse(input);
    const template = { ...parsed, status: "approved" as const };
    this.templates.set(parsed.name, template);
    this.queue.push({ playerId: "system", text: parsed.name, reason: "template-change", status: "queued" });
    return template;
  }

  submitPlayerReport(playerId: string, text: string): ModerationItem {
    const item: ModerationItem = { playerId, text, reason: "player-report", status: "queued" };
    this.queue.push(item);
    return item;
  }

  render(name: string, values: Record<string, string>) {
    const template = this.templates.get(name);
    if (!template || template.status !== "approved") throw new Error("template is not approved");
    return template.body.replace(/\{(\w+)\}/g, (_match: string, key: string) => values[key] ?? `{${key}}`);
  }

  pendingModeration() { return this.queue.filter((item) => item.status === "queued"); }
}

export async function inspectDelivery(messageId: string) {
  return infrai.sms.events(messageId);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new GameSmsService();
  service.approveTemplate({ name: "event-reminder", signature: "Arcade", body: "{player}, event starts at {time}", variables: ["player", "time"] });
  console.log({ message: service.render("event-reminder", { player: "Mina", time: "20:00" }), moderation: service.pendingModeration() });
}
