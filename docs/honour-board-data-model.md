# Honour board TV data model

The honour board is a public display layer for wall-mounted TVs, venue screens, kiosk panels and web-app driven installations.

It should be fed by public-safe JSON, not raw club records.

## Source systems

- Google Sheets: catch ledger, member-approved honours, events, sponsor slots and notices.
- Google Drive: approved media and wall-art assets.
- Google My Maps / KMZ: public landmarks and access points.
- Agent export: converts private records into public-safe summaries.

## Public display rules

- Show length-photo records, not weigh-in framing.
- Legal fish may be kept for food, but competition scoring should not require fish to be killed to win.
- Show broad public map points only.
- Do not show exact fishing spots, live team GPS, contact details, private payments, emergency contacts or unapproved media.
- Optimise for 16:9 screens, kiosk readability and low-motion operation.

## Example file

See `data/example-honour-board-tv.json`.
