# Component Lock System — Wealthsimple-Like Reuse Rules

All UI component files use lowercase kebab-case.
All exports use PascalCase.

## Locked folders

### `components/ui-shell/`
Locked files:
- `sidebar.tsx`
- `topbar.tsx`
- `right-rail.tsx`
- `app-shell.tsx`

Never duplicate them.

### `components/ui-patterns/`
Preferred files:
- `hero-balance.tsx`
- `chart-surface.tsx`
- `support-panel.tsx`
- `account-row.tsx`
- `summary-metric.tsx`
- `section-header.tsx`
- `empty-state.tsx`

Create these if missing.
Consolidate equivalents into them.

### `components/ui-primitives/`
Preferred files:
- `button.tsx`
- `input.tsx`
- `badge.tsx`
- `tooltip.tsx`
- `avatar.tsx`
- `segmented-control.tsx`

Reuse first.

## Core rules
- do not inline repeated surface styles more than once
- do not recreate account rows on every page
- do not recreate support panels on every page
- do not create alternate chart wrappers
- extend via props instead of duplication

## WS-specific lock
If a component influences the hero graph / balance area, treat it as a locked pattern.
Do not let chart surfaces drift page to page.
