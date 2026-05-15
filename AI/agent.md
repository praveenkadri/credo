# Credo Agent Directive

Credo uses the AI folder as a **design-system source of truth**, not as loose notes.

Credo should feel like:

> Nivo brand confidence + Wealthsimple calm + WaveApps business utility.

Core product feeling:
- quiet
- premium
- editorial
- financial
- precise
- operational
- low-noise
- guided only when needed

Do not make Credo look like a generic SaaS dashboard.

## Non-negotiable rules

1. Use `AI/design-system/credo-design-system.md` as the primary design source.
2. Preserve Credo’s compact app shell, warm neutral canvas, deep green identity, and low-noise surfaces.
3. Do not solve empty pages by adding fake cards, fake modules, or dense onboarding blocks.
4. Use progressive navigation: hide modules until they are useful.
5. Main content should not explain the app. Guidance belongs in the right rail, setup banner, or one short empty label.
6. Right rail usually has one primary next step, not multiple equal buttons.
7. Reuse existing components and tokens. Avoid one-off `div` styling for repeated UI.
8. Do not change auth, Supabase, RLS, payroll, PDF, or storage logic unless the task explicitly asks for it.

If a screen feels busy, remove UI.
If a screen feels empty, first ask whether the module should be hidden until useful.
