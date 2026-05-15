# Codex Apply Prompt

Use this prompt when asking Codex to apply the cleaned Credo design system.

```txt
Read the cleaned AI folder first, in this order:

1. AI/agent.md
2. AI/agent-read-order.md
3. AI/design-system/credo-design-system.md
4. AI/rules/progressive-navigation.md
5. AI/rules/overview-empty-state-rules.md
6. AI/rules/right-rail-rules.md
7. AI/rules/shell-layout-rules.md
8. AI/rules/component-system-rules.md
9. AI/checklists/design-review-checklist.md
10. AI/checklists/implementation-guardrails.md

Apply these rules as the source of truth.

Priority task:
Fix Credo to follow the cleaned Nivo/WS-inspired design system.

Focus areas:
- strict progressive sidebar navigation
- Overview simplification
- no main-body instructional text
- no Overview status/readiness row
- one-action right rail behavior
- deep green token discipline
- reuse existing components

Hard target for an early workspace with one company, incomplete setup, zero employees, zero payroll runs, and zero documents:
- Sidebar shows only Overview and Companies.
- Main overview shows only setup banner if needed, Cash movement, $0.00, No payroll activity yet, and Companies list.
- Right rail shows exactly one primary next step, likely Complete setup.
- Do not show Team, Payroll, Documents, Insights, or Compliance in sidebar unless their unlock rules are met or the user is already on those routes.

Do not change auth, Supabase, RLS, payroll calculations, PDF generation, document storage, or database schema.

Run npm run build and return changed files plus a short summary.
```
