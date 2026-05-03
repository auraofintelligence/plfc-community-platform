# Stripe Commerce Plan

This file is a practical plan, not a live payment integration.

No secret keys belong in this repository.

## Recommended Order

1. Start with Stripe Payment Links for simple one-off items.
2. Add Checkout Sessions when the website has forms and needs to pass member or competition metadata into Stripe.
3. Add Billing only if the committee approves automatic recurring annual renewal.

## First Payment Link Candidates

- Annual Social Membership - $20
- 1-Comp Casual Membership - $25
- Adult Annual Membership - $75

These are clear, low-complexity products.

## Membership Products

Each membership product should become:

- one Stripe Product
- one AUD Price
- one public Payment Link or Checkout path
- metadata for the member type

Suggested metadata:

```json
{
  "member_type": "adult_annual",
  "source": "plfc_community_platform"
}
```

## Competition Products

Simple version:

- one Payment Link per competition
- custom fields for participant details where practical
- manual export after the competition closes

Better version:

- website form first
- Checkout Session second
- event and participant metadata attached to the checkout
- confirmation email after successful payment

Suggested metadata:

```json
{
  "event_id": "competition_slug_here",
  "member_type": "casual_comp",
  "source": "plfc_community_platform"
}
```

## Fundraisers

Fundraisers need clear campaign names so money can be reported cleanly.

Possible campaign products:

- Junior Fishing Education Sponsor
- Working Bee Support
- Grant Co-Funding Pool

Suggested metadata:

```json
{
  "campaign": "junior_education",
  "source": "plfc_community_platform"
}
```

## Merchandise

Start simple:

- Club Hat
- Fishing Shirt
- Supporter Pack

Use Payment Links if the item is simple.

Use Checkout Sessions if size, pickup, shipping or multiple options become awkward.

## Renewal Logic

Do not build manual annual-renewal charging with raw payment APIs.

If renewals become automatic:

- use Stripe Billing
- use Stripe Customer Portal for payment method updates and cancellation
- make consent extremely clear before activating recurring payments

If renewals stay manual:

- use one-time Payment Links or Checkout Sessions
- trigger email and SMS reminders from the membership expiry date

## Go-Live Checks

- Committee-approved prices.
- Committee-approved benefits and refund language.
- Stripe account ownership confirmed.
- Bank settlement details confirmed.
- Privacy and consent wording approved.
- Product metadata agreed.
- Test-mode payment completed.
- Export and reconciliation path tested.
