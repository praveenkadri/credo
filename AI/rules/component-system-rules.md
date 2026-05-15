# Component System Rules

Every repeated pattern must be componentized.

Avoid one-off repeated `div` styling.

## Required reusable patterns

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
- field wells
- summary rows

## Component principles

1. Prefer fewer, stronger components.
2. Compose pages from shared primitives.
3. Use semantic tokens, not hardcoded colors.
4. Do not duplicate marketing/auth/app patterns unless they have distinct product reasons.
5. When in doubt, simplify the component rather than decorate it.

## Color implementation

Use tokens from:

- `AI/design-system/credo-design-system.md`
- `AI/design-system/credo-tokens.css`

Direct hex colors should be rare and justified.

## Button rule

Use one primary CTA per decision surface.

Avoid multiple green buttons in one section.

## Copy rule

Use simple human language.

Preferred:
- Add employee
- Run payroll
- Complete setup
- No payroll activity yet
- No records yet

Avoid:
- operational signal
- activate this module
- surface will populate
- leverage
- streamline
- mission-critical
