# Credo Typography Rules — WS-Inspired Strict System

## Purpose

Credo must follow a disciplined Wealthsimple-inspired typography system across every screen.

The typography goal is:

- Clear hierarchy
- High legibility
- Calm financial trust
- Human, premium, non-corporate tone
- Stable financial numbers
- Minimal visual noise

Typography must never feel cramped, decorative, overly bold, or inconsistent.

---

## 1. Font Family Rules

### 1.1 App UI Font

All application UI must use a clean geometric sans-serif font.

Preferred stack:

```css
font-family:
  Inter,
  "SF Pro Text",
  "Helvetica Neue",
  Arial,
  sans-serif;
```

Use this font for:

- Dashboard
- Sidebar
- Topbar
- Tables
- Forms
- Filters
- Buttons
- Payroll pages
- Company pages
- Employee / Team pages
- Documents pages
- Settings pages
- Modals
- Empty states
- Helper text

Do not introduce random font families per page.

### 1.2 Marketing / Hero Serif Font

A serif font may only be used for large marketing-style hero headings or public landing page statements.

Preferred stack:

```css
font-family:
  Georgia,
  "Times New Roman",
  serif;
```

Allowed usage:

- Homepage hero headline
- Brand statement
- Large public marketing message

Forbidden usage:

- App dashboard
- Forms
- Tables
- Buttons
- Sidebar
- Payroll flow
- Company create/edit pages
- Employee create/edit pages
- Documents pages

The app interface must remain sans-serif.

---

## 2. Font Size Scale

Credo must use a fixed type scale.

Do not invent new font sizes unless a specific component already defines one in the design system.

### 2.1 Desktop Scale

| Role | Size | Weight | Line Height | Usage |
|---|---:|---:|---:|---|
| Page H1 | 32px–40px | 650–700 | 1.15–1.2 | Main page title |
| Section H2 | 20px–24px | 600–650 | 1.2–1.3 | Section or modal title |
| Card / Panel Title | 17px–18px | 600 | 1.3 | Surface title |
| Body Default | 16px | 400 | 1.5 | Main readable text |
| Body Small | 14px | 400–500 | 1.45 | Helper text, sidebar labels |
| Caption / Legal | 12px | 400 | 1.4 | Fine print, metadata |
| Button / CTA | 14px–16px | 600 | 1.2 | Button text |
| Metric Large | 28px–40px | 650–700 | 1.1–1.15 | Financial headline numbers |
| Metric Small | 14px–18px | 500–650 | 1.25 | Table amounts, payroll values |

### 2.2 Forbidden Sizes

Avoid these unless already required by a component token:

- 10px
- 11px
- 13px for primary readable content
- Random values like 15px, 19px, 21px, 27px

Small text must not become unreadable. Default body content should be 16px.

---

## 3. Font Weight Rules

Typography must use restraint.

### 3.1 Allowed Weights

| Weight | Usage |
|---:|---|
| 400 | Default body text |
| 500 | Labels, secondary emphasis, table labels |
| 600 | Buttons, section titles, important names |
| 650–700 | Page titles, financial headline values |

### 3.2 Bold Usage Rules

Use semibold/bold only for scannable information:

- Page titles
- Account/company names
- Employee names
- Financial totals
- Primary actions
- Important table values

Do not bold entire paragraphs.

Do not use bold as decoration.

If everything is bold, nothing is important.

---

## 4. Financial Metric Typography

Financial values must feel stable and trustworthy.

### 4.1 Required Number Styling

All money, rates, totals, payroll amounts, percentages, counts, balances, hours, and table numbers must use tabular numbers.

Required CSS:

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1, "lnum" 1;
```

Apply this to:

- Dollar amounts
- Payroll totals
- Tax amounts
- Net pay
- Gross pay
- Dates in tables
- Hours
- Employee counts
- Company totals
- Rates
- Percentages
- Dashboard metrics

### 4.2 Metric Hierarchy

Large money values:

```css
font-size: 32px;
line-height: 1.12;
font-weight: 650;
letter-spacing: -0.03em;
font-variant-numeric: tabular-nums;
```

Table money values:

```css
font-size: 14px;
line-height: 1.25;
font-weight: 500;
font-variant-numeric: tabular-nums;
```

Never use playful, decorative, condensed, or overly rounded fonts for financial data.

---

## 5. Color + Contrast Rules for Text

Typography must create depth using contrast, not borders.

### 5.1 Text Color Roles

| Role | Color Guidance | Usage |
|---|---|---|
| Primary Text | Near black | Titles, values, main content |
| Secondary Text | Soft grey | Labels, descriptions |
| Muted Text | Lighter grey | Metadata, placeholders |
| Disabled Text | Very soft grey | Disabled states only |
| Error Text | Theme error token only | Validation messages |

### 5.2 Strict Rule

Labels must be visually lighter than values.

Example:

```tsx
<p className="text-sm text-muted">Pay period</p>
<p className="text-base font-medium text-primary">Apr 1 – Apr 15</p>
```

Do not make label and value the same visual weight.

Do not use pure red unless it comes from Credo’s approved theme error token.

---

## 6. Line Height Rules

Text must never feel cramped.

### 6.1 Required Leading

| Text Type | Line Height |
|---|---:|
| Body text | 1.5 |
| Small body | 1.45 |
| Caption | 1.4 |
| Section title | 1.2–1.3 |
| Page title | 1.15–1.2 |
| Large metric | 1.1–1.15 |

### 6.2 Paragraph Rule

Any paragraph longer than one line must use generous leading.

Minimum:

```css
line-height: 1.5;
```

Do not use tight line-height on helper text, descriptions, or empty states.

---

## 7. Letter Spacing Rules

Use subtle letter spacing only where needed.

### 7.1 Headings

Large headings may use slight negative tracking:

```css
letter-spacing: -0.03em;
```

### 7.2 Body Text

Body text should usually use normal tracking:

```css
letter-spacing: 0;
```

### 7.3 Labels / Eyebrows

Small uppercase labels may use:

```css
letter-spacing: 0.04em;
text-transform: uppercase;
```

Use uppercase labels sparingly.

Do not uppercase long button text or table content.

---

## 8. Button Typography Rules

Buttons must feel calm, premium, and consistent.

### 8.1 Button Text

Use:

```css
font-size: 14px;
font-weight: 600;
line-height: 1.2;
letter-spacing: -0.01em;
```

### 8.2 Casing

Preferred:

- Title Case
- Sentence case

Avoid:

- ALL CAPS for normal buttons
- Overly bold button text
- Different button font sizes on the same page

### 8.3 Button Consistency

Primary, secondary, ghost, and destructive buttons must share the same typography system.

Only color, surface, and emphasis may change.

---

## 9. Form Typography Rules

Forms must follow a strict label/value/help hierarchy.

### 9.1 Field Label

```css
font-size: 14px;
font-weight: 500;
line-height: 1.35;
color: var(--text-secondary);
```

### 9.2 Field Input

```css
font-size: 16px;
font-weight: 400;
line-height: 1.4;
color: var(--text-primary);
```

### 9.3 Helper Text

```css
font-size: 13px or 14px;
font-weight: 400;
line-height: 1.45;
color: var(--text-muted);
```

### 9.4 Error Text

```css
font-size: 13px or 14px;
font-weight: 400;
line-height: 1.45;
color: var(--error-text);
```

Errors must be calm and readable, not loud.

---

## 10. Table Typography Rules

Tables must prioritize scanning.

### 10.1 Table Header

```css
font-size: 12px;
font-weight: 500;
line-height: 1.3;
letter-spacing: 0.02em;
color: var(--text-muted);
```

### 10.2 Table Body

```css
font-size: 14px;
font-weight: 400;
line-height: 1.4;
color: var(--text-primary);
```

### 10.3 Important Table Value

```css
font-size: 14px;
font-weight: 500;
font-variant-numeric: tabular-nums;
```

Do not make entire table rows bold.

Only key values may use medium weight.

---

## 11. Sidebar Typography Rules

Sidebar typography must be quiet and precise.

### 11.1 Sidebar Item

```css
font-size: 14px;
font-weight: 500;
line-height: 1.25;
letter-spacing: -0.01em;
```

### 11.2 Active Sidebar Item

```css
font-weight: 600;
```

Active state should not rely on heavy bold alone.

Surface, icon state, and subtle contrast should carry the interaction.

---

## 12. Topbar Typography Rules

Topbar text must align visually with page content.

### 12.1 Company Selector

```css
font-size: 14px;
font-weight: 600;
line-height: 1.25;
```

### 12.2 Secondary Company Info

```css
font-size: 12px;
font-weight: 400;
line-height: 1.35;
color: var(--text-muted);
```

Topbar typography must not compete with the page H1.

---

## 13. Empty State Typography Rules

Empty states must feel helpful, not loud.

### 13.1 Empty State Title

```css
font-size: 18px;
font-weight: 600;
line-height: 1.3;
```

### 13.2 Empty State Body

```css
font-size: 14px or 16px;
font-weight: 400;
line-height: 1.5;
color: var(--text-secondary);
```

Avoid oversized empty state headings.

Avoid cartoonish or overly playful typography.

---

## 14. Responsive Typography Rules

### 14.1 Mobile

On smaller screens:

- Page H1 may reduce to 28px–32px
- Section H2 may reduce to 18px–22px
- Body must stay at 16px
- Captions must not go below 12px
- Buttons should remain 14px–16px

### 14.2 Never Shrink Body Below 16px

For accessibility, primary reading text must remain 16px.

---

## 15. Tailwind Token Recommendations

Use shared typography tokens instead of random utility combinations.

Recommended token classes:

```ts
const typography = {
  pageTitle:
    "text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-primary",

  sectionTitle:
    "text-[22px] leading-[1.25] font-semibold tracking-[-0.02em] text-primary",

  panelTitle:
    "text-[18px] leading-[1.3] font-semibold tracking-[-0.015em] text-primary",

  body:
    "text-[16px] leading-[1.5] font-normal text-primary",

  bodySmall:
    "text-[14px] leading-[1.45] font-normal text-secondary",

  label:
    "text-[14px] leading-[1.35] font-medium text-secondary",

  caption:
    "text-[12px] leading-[1.4] font-normal text-muted",

  button:
    "text-[14px] leading-[1.2] font-semibold tracking-[-0.01em]",

  metricLarge:
    "text-[32px] leading-[1.12] font-semibold tracking-[-0.03em] tabular-nums",

  metricSmall:
    "text-[14px] leading-[1.25] font-medium tabular-nums",
};
```

All pages should reuse these patterns.

---

## 16. Strict Do / Do Not Rules

### Do

- Use 16px as the default readable body size
- Use tabular numbers for all metrics
- Use grey labels and darker values
- Use semibold only for scannable hierarchy
- Use generous line height
- Keep typography calm and clean
- Keep app UI sans-serif
- Keep marketing serif usage limited

### Do Not

- Do not use random font sizes per page
- Do not use tiny 10px or 11px UI text
- Do not bold every label
- Do not use all caps everywhere
- Do not use serif fonts inside app workflows
- Do not use playful fonts
- Do not use overly tight line height
- Do not use pure red error text unless approved by theme
- Do not let financial numbers shift or wiggle
- Do not create visual hierarchy using borders when typography and spacing can do it

---

## 17. QA Checklist

Before considering any Credo screen complete, verify:

- Body text is at least 16px where users need to read
- Labels are lighter than values
- Financial numbers use tabular numbers
- Page title is clearly larger than section titles
- Section titles are clearly larger than body text
- Buttons use consistent typography
- Tables are scannable without excessive bold
- Helper text is readable and calm
- Error text uses Credo theme tokens
- No random font family was introduced
- No app workflow uses serif typography
- Line height does not feel cramped
- Typography works with whitespace instead of borders

---

## 18. Non-Negotiable Rule

Credo typography must feel like a premium financial product.

If typography looks:

- cramped
- loud
- inconsistent
- over-bold
- too small
- overly decorative
- visually unstable

then it does not meet the WS-inspired standard and must be corrected before moving forward.
