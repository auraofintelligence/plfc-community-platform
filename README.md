# Point Lookout Fishing Club Community Platform

Exploratory open-source static website prototype for the Point Lookout Fishing Club.

The goal is to give the secretary and committee a working interface they can inspect, discuss and improve before replacing or extending the current public site.

## What This Prototype Covers

- Public dashboard for the club story and next-step readiness.
- Stripe-ready commerce structure for memberships, casual competition fees, fundraisers and merchandise.
- Membership lifecycle flow based on the supplied flow chart.
- Committee meeting flow based on the supplied meeting chart.
- AGM roadmap page using the supplied roadmap visual.
- Product data scaffold in `data/stripe-products.json`.

## Pages

- `index.html` - public dashboard and prototype overview.
- `commerce.html` - Stripe-ready memberships, competition fees, fundraisers and merchandise.
- `processes.html` - membership and committee meeting process flows.
- `roadmap.html` - AGM roadmap and next actions.
- `docs/stripe-commerce-plan.md` - plain-English Stripe setup plan.

## Sources Used

- Current public site: https://pointlookoutfishingclub.com
- Current AGM dashboard: https://auraofintelligence.github.io/PLFC_2026_Data/
- Current shop products discovered from the public shop page:
  - 1-Comp Casual Membership - $25
  - Adult Annual Membership - $75
  - Annual Social Membership - $20
  - Cadet Annual Membership - $50
  - Junior Annual Membership - $30
  - Legendary Lifetime Member - $1,000 and $5,000
- Local supplied files:
  - `PLFC  Meetings Flow Chart.png`
  - `PLFC  Members Flow Chart.png`
  - `PLFC AGM Roadmap.png`
  - `plfc comp1 photo.jpg`
  - `plfc comp1 wrapup.jpg`
- Stripe guidance:
  - Payment Links for simple one-time products.
  - Checkout Sessions for web app checkout.
  - Billing only for approved recurring renewals.
  - API version verified as `2026-02-25.clover` on Stripe documentation.

## Running Locally

This is a static site. You can open `index.html` directly in a browser.

For a local server:

```powershell
python -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Open-Source Boundary

The code is prepared under the MIT License.

Club name, club material, photos, flow charts, AGM material and any future official copy should be treated as Point Lookout Fishing Club material unless the committee approves a separate content licence.

## Before Public Launch

- Confirm every fee and product description with the committee.
- Decide which payments are allowed to go live first.
- Confirm Stripe account ownership and bank settlement details.
- Add privacy wording for member data, newsletter consent and SMS consent.
- Decide which uploaded documents can be public.
- Replace prototype wording with approved club wording.
- Decide whether this prototype replaces, links from or sits beside the current WordPress site.
