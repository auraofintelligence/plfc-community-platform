# AGENTS.md

Use Australian English.

This repo is for an exploratory Point Lookout Fishing Club website prototype. Keep changes practical, readable and easy for Luke and committee members to understand.

## Working Style

- Explain changes step by step in simple language.
- Prefer static HTML, CSS and small JavaScript unless there is a strong reason to add a build system.
- Keep sensitive documents, keys, member data and payment secrets out of the public repo.
- Treat prices, benefits, official club wording and privacy wording as committee-approval items.
- Do not connect live payments without explicit approval.

## Design Direction

- Similar clarity and warmth to the Strange but True repo.
- Daylight palette: ocean blues, sky blues, near-white sand, Moreton Bay greens, purple, gold, emerald and titanium.
- Keep the interface calm, legible and committee-friendly.
- Use real supplied assets where possible.

## Commerce Direction

- Payment Links first for simple one-time products.
- Checkout Sessions when forms and metadata are needed.
- Billing only if annual auto-renewal is approved.
- No Stripe secret keys in repo files.

## Field Ops Direction

- `field-ops.html` is a visualisation layer, not a data-fetching engine.
- It reads `data/latest-field-data.json`.
- A separate agent stream, cron job or backend can update that JSON later.
- Do not place real member GPS coordinates, phone numbers, emergency contacts or private media URLs in public repo files.
- Keep field data storytelling broad, consent-aware and safety-first.
