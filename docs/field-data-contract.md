# Field Data Contract

The Field Ops page is a visual layer.

It reads:

```text
data/latest-field-data.json
```

Another agent, cron job or future backend can update that file. The website then turns the latest snapshot into cards, ribbons and story blocks.

## Why This Shape

- The visual site stays simple.
- Data collection can evolve separately.
- Sensitive GPS and uploads can be handled by a safer private system later.
- The committee can inspect the story without needing to understand the data pipeline.

## Current Sections

- `event` - event name and location label.
- `score` - simple planning signal.
- `story` - headline, summary and longer readout.
- `tide`, `weather`, `team`, `media` - top-line summary cards.
- `windows` - time ribbon for tide, solunar, weather, event and media moments.
- `solunarCalendar` - seven-day cards for moon phase, rating, major/minor windows and tide timing.
- `tideCurve` - simple tide-height points for a visual bar curve.
- `monitors` - condition tiles.
- `weatherVisuals` - gauge-style weather readings such as wind, swell, UV and rain.
- `mediaItems` - photo, video and note queue.
- `mapLayers` - future digital twin layers.

## Privacy Rule

Do not put real member GPS coordinates, phone numbers, emergency contacts or private media URLs in this public JSON file.

For public demos, use broad labels, counts, summaries and permission status only.
