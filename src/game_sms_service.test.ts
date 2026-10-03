import assert from "node:assert/strict";
import { GameSmsService } from "./game_sms_service.js";

const service = new GameSmsService();
service.approveTemplate({ name: "raid-open", signature: "Arcade", body: "{player}: raid opens {time}", variables: ["player", "time"] });
assert.equal(service.render("raid-open", { player: "Kai", time: "21:00" }), "Kai: raid opens 21:00");
const report = service.submitPlayerReport("p-42", "spam invite");
assert.equal(report.status, "queued");
assert.equal(service.pendingModeration().length, 2);
console.log("template approval and moderation queue test passed");
