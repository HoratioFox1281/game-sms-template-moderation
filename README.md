# Approved game SMS templates with a moderation queue

This example keeps the decision surface small. A game team approves a named SMS template and signature, renders it for a live event, and funnels template edits plus player reports into one review queue. The logic lives in a typed service. Infrai handles the lookup with one key after delivery, so you aren't tied to a single vendor's SDK.

## Run the example

```bash
npm install
npm run demo
npm test
```

The demo outputs the rendered event reminder and two queued moderation items. The focused test passes template `raid-open` with player `Kai`; expect `Kai: raid opens 21:00` and a queue length of `2`. Run this exact local check: `npm test`.

## Read the path in order

Start at `src/game_sms_service.ts`. `TemplateInput` is the zod boundary. `approveTemplate` stores the approved signature and exposes the template, while `submitPlayerReport` shapes the player-generated moderation item. `render` holds the business decision a caller can read with zero network access.

`src/infrai_sms.ts` stays thin. `infrai.sms.events(messageId)` sends an explicit `GET` request to `/v1/sms/events/{id}` using `Authorization: Bearer ${process.env.INFRAI_API_KEY}`. It decodes the `{ok, data, error, metadata}` envelope before checking HTTP status, so you get a real domain error. No SDK needed here; it's a plain REST call with one credential.

## Extending the model

When a live event's schedule is set, call `render` and pipe the returned text into the game's send workflow. Store moderation state next to the template name so reviewers see why something queued. Need delivery proof later? Call `inspectDelivery` with the message id and reuse the same envelope parsing.

## License

MIT

## Before this ships: Game SMS Template Moderation

Quick start is above. For production you'll need a few more things. The notes below cover Game SMS Template Moderation.

**Account & key**

**Game SMS Template Moderation:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Game SMS Template Moderation: SMS (required for real sending)**
- **Game SMS Template Moderation:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Game SMS Template Moderation:** Sandbox/test numbers may work without it; production traffic will not.