# Credo Design System: Nivo DNA + WS Calm + Business Operations

Credo should feel like Nivo’s sister brand, but more operational, business-grade, payroll-focused, and calm.

Credo is not a generic SaaS dashboard.

Credo should feel:
- premium
- quiet
- financial
- operational
- trustworthy
- editorial
- precise
- low-noise
- guided only when needed

Credo’s design DNA:

> Wealthsimple calm workspace + Nivo green brand confidence + WaveApps business utility.

---

## 1. Core product feeling

Credo is a workspace for:
- multi-company management
- payroll
- employees/team
- documents
- compliance
- business operations

The UI should not feel like a busy admin panel. The interface should feel like a premium financial workspace where only relevant things appear when they matter.

### Hard rule

Less UI. More hierarchy.

Do not fill empty pages with instructional cards, checklists, or placeholder modules just to reduce whitespace. Whitespace is allowed.

---

## 2. Sister-brand relationship with Nivo

Credo and Nivo share the same design DNA.

Shared DNA:
- warm neutral shell
- deep green brand confidence
- calm typography
- layered surfaces
- low-border UI
- soft shadows
- rounded shapes
- simple language
- progressive disclosure
- financial trust

Difference:

| Product | Personality |
|---|---|
| Nivo | Personal finance intelligence, softer, more consumer-friendly |
| Credo | Business operations, payroll, documents, compliance, more precise and work-focused |

Credo should be slightly more restrained than Nivo.

Nivo can feel more expressive. Credo must feel more operational.

---

## 3. Visual direction

Credo should look top 1%, not like a regular SaaS dashboard.

Visual direction:
- ultra-premium
- warm neutral
- quiet green identity
- layered but not card-heavy
- high whitespace
- editorial typography
- confident metrics
- minimal borders
- soft financial trust
- no clutter
- no fake dashboard density

Avoid:
- generic dashboard cards
- too many grids
- too many badges
- bright SaaS colors
- overusing green backgrounds
- dense onboarding blocks
- placeholder-heavy pages
- explaining the app in the main content

---

## 4. Surface system

Credo does not use generic cards. Use layered surfaces.

### Shell layer

Full app background. Use a warm parchment/off-white tone.

Purpose:
- creates calm business-finance atmosphere
- prevents the app from feeling like a cold white SaaS dashboard

Token:

```css
--credo-shell: #F2F1ED;
```

### Workspace layer

Large primary content area, usually white or near-white.

Token:

```css
--credo-panel: #FFFFFF;
```

### Section layer

Major content zones:
- right rail
- company row
- payroll run surface
- document ledger
- setup banner
- filter rail

Token:

```css
--credo-section: #F8F7F4;
```

### Inset layer

Tinted nested surfaces:
- selected nav item
- table header
- selected filters
- field wells
- confirmation summary areas

Token:

```css
--credo-inset: #F3F2EE;
```

### Micro layer

Small UI details:
- pills
- status dots
- icon wells
- step indicators
- tiny counters

Recommended:
- 28px icon well
- 22px step circle
- 5px status dot
- soft green active state

---

## 5. Color tokens

Credo should use Nivo-like green, but slightly more mature and business-focused.

```css
:root {
  /* Shell */
  --credo-shell: #F2F1ED;
  --credo-panel: #FFFFFF;
  --credo-surface: #F8F7F4;
  --credo-inset: #F3F2EE;

  /* Ink */
  --credo-ink: #151713;
  --credo-ink-soft: #34362F;
  --credo-muted: #74776F;
  --credo-faint: #A7AAA2;

  /* Brand */
  --credo-green: #0B5A3D;
  --credo-green-hover: #084A33;
  --credo-green-soft: #EDF5EF;
  --credo-green-wash: #F5FAF6;
  --credo-green-border: rgba(11, 90, 61, 0.16);
  --credo-green-ring: rgba(11, 90, 61, 0.22);

  /* Status */
  --credo-success: #0B5A3D;
  --credo-warning: #E88916;
  --credo-danger: #C9332A;
  --credo-info: #496A8F;

  /* Borders */
  --credo-border-soft: rgba(21, 23, 19, 0.08);
  --credo-border-medium: rgba(21, 23, 19, 0.12);

  /* Shadows */
  --credo-shadow-soft: 0 18px 48px rgba(21, 23, 19, 0.08);
  --credo-shadow-panel: 0 10px 28px rgba(21, 23, 19, 0.06);
  --credo-shadow-micro: 0 4px 14px rgba(21, 23, 19, 0.05);
}
```

### Color rules

Green is the brand identity.

Use green for:
- primary CTA
- active nav
- active company/workspace cue
- success states
- trusted financial states
- one key brand moment per page

Do not use green for:
- every card
- full dashboard backgrounds
- decorative blocks everywhere
- unrelated filler accents

Supporting colors are allowed, but green must lead.

---

## 6. Typography

Use **Plus Jakarta Sans** for the app UI.

The UI should feel crisp, financial, and editorial.

### Font rules

- Body: Plus Jakarta Sans
- Logo/wordmark can use a refined custom treatment, but app UI stays Plus Jakarta Sans
- Numbers and money values must use `font-variant-numeric: tabular-nums`
- Micro labels should be uppercase and letter-spaced
- Avoid overly bold SaaS headings

### Recommended sizes

```css
--text-nav: 13px;
--text-micro: 10.5px;
--text-body: 13px;
--text-body-lg: 15px;
--text-section: 17px;
--text-page-title: 34px;
--text-kpi: 56px;
```

Micro labels:

```css
font-size: 10.5px;
font-weight: 700;
letter-spacing: 0.08em;
text-transform: uppercase;
```

Navigation:

```css
font-size: 13px;
font-weight: 500;
```

KPI values:

```css
font-size: 56px;
font-weight: 600;
letter-spacing: -0.06em;
font-variant-numeric: tabular-nums;
```

Section titles:

```css
font-size: 17px;
font-weight: 650;
letter-spacing: -0.02em;
```

---

## 7. Spacing

Use an 8px system, but allow precise values for financial layouts.

Base spacing:
- App shell padding: 12–16px
- Main shell gap: 16px
- Page top padding: 24–32px
- Section padding: 20–26px
- Right rail gap: 16px
- List row height: 54–68px
- Icon square: 28px × 28px
- Step circle: 22px × 22px
- Status dot: 5px

### Hard spacing rule

Do not create large gaps between:
- sidebar and main content
- main content and right rail
- topbar and page content

Credo should feel spacious, but not disconnected.

---

## 8. Shadows and borders

Use shadows as atmosphere, not decoration.

Preferred:
- broad soft shadows
- low opacity
- subtle y-offset
- shallow inset shadows for selected/inset areas

Avoid:
- heavy black shadows
- hard card-stack shadows
- thick borders
- every section having a border

Borders should be rare and soft.

```css
border: 1px solid rgba(21, 23, 19, 0.08);
```

---

## 9. Layout principles

Credo pages should use this hierarchy:

```txt
Shell
  Sidebar
  Main workspace
    Topbar
    Page content
  Right rail, only when useful
```

### Main content rules

The main area should show:
- real data
- primary metric
- company/account rows
- ledgers
- forms
- records
- clean empty state

The main area should not explain the product.

Avoid main-body text like:
- “This workspace is set up, but…”
- “Next steps live in the rail…”
- “Start by…”
- “Once you do this…”

Help text belongs in:
- right rail
- setup banner
- short empty-state label
- form helper copy only when necessary

---

## 10. Progressive navigation

Credo should not show every module from day one. Progressive navigation is required.

Always visible:

```txt
Overview
Companies
```

Show Team only when:
- `employeeCount > 0`
- OR user is on `/team` or `/employees`
- OR user is inside add/edit employee flow

Do not show Team just because a company exists.

Show Payroll only when:
- `employeeCount > 0`
- OR `payrollRunCount > 0`
- OR `payrollSetupStarted === true`
- OR user is on `/payroll`
- OR user is inside run payroll flow

Do not show Payroll just because setup is incomplete.

Show Documents only when:
- `generatedDocumentCount > 0`
- OR `payrollRunCount > 0`
- OR user is on `/documents`

Show Insights only when:
- `payrollRunCount > 0`
- OR `generatedDocumentCount > 0`
- OR `meaningfulActivityCount > 0`
- OR user is on `/insights`

Show Compliance only when:
- `complianceTaskCount > 0`
- OR `taxDetailsExist === true`
- OR `payrollComplianceSetupStarted === true`
- OR user is on `/compliance`

Conservative rule: if unsure, hide the module.

Exception: if the user is already on the route, show that route temporarily so navigation does not feel broken.

---

## 11. Right rail system

The right rail is for context and next steps. It should not become a second dashboard.

Use the right rail for:
- one primary next step
- filters
- small operational context
- short reminders
- workspace guidance
- related actions

Avoid:
- long checklists
- multiple equal CTA buttons
- duplicate actions already shown in main content
- dense filter lists when the main page has no data

### One-action rule

The right rail should usually show exactly one primary action.

| Workspace state | Right rail primary action |
|---|---|
| No company | Add company |
| Company exists, setup incomplete | Complete setup |
| Company setup complete, no employee | Add employee |
| Employee exists, payroll incomplete | Complete payroll setup |
| Payroll ready, no run | Run payroll |
| Payroll run exists | Review payroll |
| Documents exist | View documents |

Secondary guidance may be one muted sentence only.

Example:

```txt
Payroll and documents appear as your workspace becomes active.
```

Do not show two or three large equal buttons.

---

## 12. Empty-state rules

Credo empty states must be calm and minimal.

Main empty state:

```txt
Eyebrow
Large metric or title
One short empty label
```

Example:

```txt
Cash movement
$0.00
No payroll activity yet
```

Do not add long explanatory paragraphs.

Empty/help text should appear only as the first clean section, not spread across the page.

Do not add:
- setup grids
- readiness rows
- placeholder dashboard cards
- repeated empty illustrations
- long onboarding text

If a section is not useful yet, hide it from the sidebar instead of creating a large empty page.

---

## 13. Overview page rules

Overview is the calmest page. It should not become an onboarding dashboard.

Overview structure:

```txt
Setup banner, if needed

Cash movement
$0.00
No payroll activity yet

Companies
Company row/list

Right rail
One next step
```

Overview must not include:
- instructional paragraphs
- setup status grids
- readiness rows
- multiple inner cards
- duplicated action clusters
- fake preview modules
- empty Team/Payroll/Documents/Insights/Compliance blocks

The right rail owns next-step guidance.

---

## 14. Company page rules

Company detail should lead with company identity, not just money.

Preferred hierarchy:

```txt
Company workspace
Speriti

Payroll activity
$0.00
No payroll runs yet
```

Company pages may show:
- setup checklist if it is actionable
- employee section after employee module is relevant
- direct deposit/tax info in right rail
- recent activity when real activity exists

Avoid oversized empty employee cards.

---

## 15. Team page rules

Team should not appear until useful.

When visible, Team should feel like an employee workspace, not a placeholder page.

Label should be:

```txt
TEAM
```

or

```txt
EMPLOYEES
```

Do not use:

```txt
EMPLOYEE PROFILE
```

for the Team list page.

---

## 16. Payroll page rules

Payroll appears only when employees or payroll setup exist.

Payroll page should prioritize:
- payroll run list
- run payroll action
- payroll filters
- payroll readiness only when directly actionable

Avoid large empty illustrations.

---

## 17. Documents page rules

Documents appears only when payroll/documents exist or when manually visited.

Documents page should prioritize:
- document ledger
- filters
- generated pay stubs
- employee letters
- tax forms
- company files

If empty, keep copy minimal.

Do not show long right-rail filter lists before documents exist.

---

## 18. Insights and Compliance rules

Insights and Compliance should not appear in the sidebar for empty workspaces.

When visible, they should be data-backed.

Do not create fake preview dashboards just to make the page look full.

---

## 19. Buttons

Primary button:

```css
background: var(--credo-green);
color: white;
border-radius: 999px;
```

Hover:

```css
background: var(--credo-green-hover);
```

Secondary button:

```css
background: var(--credo-panel);
color: var(--credo-ink);
border: 1px solid var(--credo-border-soft);
```

Button rules:
- Primary action should be clear and singular.
- Do not show multiple green buttons in one section.
- Do not use black as primary action.
- Destructive actions must use danger styling.

---

## 20. Navigation

Sidebar should be compact, calm, and progressive.

Active nav should use:
- soft green wash
- green icon/text
- gentle rounded pill
- low border

Inactive nav should be muted but readable.

Avoid:
- too many visible nav items
- disabled nav items
- promotional nav links
- noisy badges

---

## 21. Forms

Forms should follow WS-like step-by-step behavior.

Rules:
- one step at a time
- clear progress
- next button
- minimal helper text
- no dense all-fields-at-once layouts
- Mapbox/address behavior should match existing company form rules
- use calm field wells
- keep labels precise

---

## 22. Language system

Credo copy should be simple and human.

Use:
- “Add employee”
- “Run payroll”
- “Complete setup”
- “No payroll activity yet”
- “No records yet”

Avoid:
- “operational signal”
- “activate this module”
- “surface will populate”
- “leverage”
- “streamline”
- “mission-critical”
- long explanatory paragraphs

Credo should sound calm and direct.

---

## 23. Component principle

Every repeated pattern must be componentized.

No repeated one-off `div` styling for:
- buttons
- pills
- icon wells
- right rail cards
- empty states
- page headers
- filters
- company rows
- status dots
- nav items
- setup banners

Use reusable components and tokens.

---

## 24. Implementation guardrails

Do not change:
- auth behavior
- Supabase logic
- RLS
- database schema
- payroll calculations
- PDF generation
- document storage
- routing semantics unless required for progressive nav

UX and design changes must not break product logic.

---

## 25. Final quality bar

Credo should feel:

```txt
quiet before it is useful
useful when data exists
guided only in the right rail
green only where it matters
premium because it is restrained
```

If a screen feels busy, remove UI.

If a screen feels empty, first ask whether the module should be hidden until useful.

Do not solve emptiness by adding fake cards.

Solve emptiness through progressive disclosure.
