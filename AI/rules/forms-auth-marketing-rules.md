# Forms, Auth, and Marketing Rules

## Forms

Credo forms should follow WS-like step-by-step behavior.

Rules:
- one step at a time
- clear progress
- primary Next button
- minimal helper text
- no dense all-fields-at-once layouts
- calm field wells
- precise labels
- review summary before submit when appropriate

Address behavior should follow the existing company form and Mapbox implementation. Do not invent a new address pattern.

## Auth

Credo auth should share Nivo’s premium green identity but stay business-focused.

Recommended desktop auth layout:
- left side: deep green brand panel
- right side: clean white/off-white auth form

Mobile:
- compact brand header
- form-first
- no awkward full-height decorative panel

Do not change Supabase auth logic while changing visuals.

## Marketing

Marketing should feel like:

> Nivo confidence + WS calm + Credo business utility.

Use:
- deep green brand moments
- strong editorial typography
- clean product structure
- restrained gradients only in marketing/auth areas

Avoid:
- generic SaaS feature card grids
- over-branded dashboards
- flashy app interior patterns

Keep `app/page.tsx` component-driven when possible. Avoid duplicate marketing systems.
