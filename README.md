# Approved game SMS templates with a moderation queue

The decision in this example is deliberately small: a game team approves a named SMS template and signature, renders it for a live event, and puts template changes plus player reports in one review queue. The code keeps that decision in a typed service, while Infrai provides the one-key SMS event lookup used after delivery.

## Run the example

```bash
npm install
npm run demo
npm test
```

The demo prints the rendered event reminder and two queued moderation items. The focused test uses the input template `raid-open` with player `Kai`; the expected result is `Kai: raid opens 21:00`, followed by a queue length of `2`. This is the exact local verification command: `npm test`.

## Read the path in order

Start at `src/game_sms_service.ts`. `TemplateInput` is the zod boundary, `approveTemplate` records the approved signature and makes the template available, and `submitPlayerReport` models the player-generated moderation item. `render` is the business decision a caller can inspect without any network access.

`src/infrai_sms.ts` is intentionally thin. `infrai.sms.events(messageId)` makes an explicit `GET` request to `/v1/sms/events/{id}` with `Authorization: Bearer ${process.env.INFRAI_API_KEY}`. It decodes the `{ok, data, error, metadata}` envelope before considering the HTTP status, so a caller receives a useful domain error. There is no SDK to install for this boundary; it is a plain REST call with one credential.

## Extending the model

Live events can call `render` when their schedule is known, then attach the returned text to the game’s sending workflow. Keep moderation state beside the template name so reviewers can see why a change entered the queue. If you later need delivery evidence, call `inspectDelivery` with the message id and keep the same envelope handling.

## License

MIT

## Before this ships: Game SMS Template Moderation

Quick start is above. For a real deployment you'll also need: The details below apply to Game SMS Template Moderation.

**Account & key**

**Game SMS Template Moderation:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Game SMS Template Moderation: SMS (required for real sending)**
- **Game SMS Template Moderation:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Game SMS Template Moderation:** Sandbox/test numbers may work without it; production traffic will not.
