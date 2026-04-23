# Codex Enforcement — Wealthsimple Execution Layer

Treat the `AI/` folder as a design system, not notes.

## Priority Order
1. `codex-enforcement.md`
2. `ws-reference-system.md`
3. `wealthsimple-page-lock.md`
4. `shell-language.md`
5. `chart-system.md`
6. shell component files
7. component lock + drift guard
8. page-specific files

## Core rule
When files conflict, prefer the option that is:
- more open
- lighter
- less boxed
- more graph-first
- more typographic
- less dashboard-like

## Never allow
- generic card dashboards
- thick borders
- dashboard filter bars
- stacked identical widgets
- heavy shadows
- bright gradients
- thick chart strokes
- generic analytics widgets
- dense enterprise chrome

## Mandatory behavior
Before coding:
1. read the required AI files
2. resolve conflicts internally
3. inspect existing components
4. reuse existing files and patterns
5. implement in one coherent pass

If a UI element can be removed instead of decorated, remove it.

If a page could be mistaken for a dashboard template, refactor it.
