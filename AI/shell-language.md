# Shell Language — Wealthsimple-Like Shared Tokens

Use this token family for the entire shell.

## 1. Base palette

Use these reference-inspired values:
- canvas: `#f5f5f1`
- slightly cooler canvas alt: `#f3f4f1`
- shell surface: `#f7f7f4`
- soft panel: `#fafaf7`
- inset plot field: `#f1f2ef`
- primary text: `#1f221c`
- secondary text: `#6e736b`
- muted text: `#93988f`
- control text: `#575b55`
- positive green: `#159947`
- positive green soft: `#dfeee3`
- guide grey: `rgba(31,34,28,0.18)`

These are reference-inspired tokens, not brand assets.

## 2. Tailwind token usage

Prefer these utility mappings:
- canvas: `bg-[#f5f5f1]`
- shell surface: `bg-[#f7f7f4]`
- soft panel: `bg-[#fafaf7]`
- inset field: `bg-[#f1f2ef]`
- primary text: `text-[#1f221c]`
- secondary text: `text-[#6e736b]`
- muted text: `text-[#93988f]`
- positive: `text-[#159947]`

## 3. Radius system

Use only:
- `rounded-lg`
- `rounded-xl`
- `rounded-2xl`
- `rounded-[28px]`

Most surfaces should live in:
- `rounded-2xl`
- `rounded-[28px]`

## 4. Shadow system

Keep shadows extremely soft:
- shell lift: `shadow-[0_1px_2px_rgba(31,34,28,0.02),0_8px_24px_rgba(31,34,28,0.03)]`
- panel lift: `shadow-[0_1px_1px_rgba(31,34,28,0.02),0_6px_18px_rgba(31,34,28,0.025)]`
- tiny active lift: `shadow-[0_1px_2px_rgba(31,34,28,0.03),0_6px_14px_rgba(31,34,28,0.04)]`

Avoid dramatic shadows.

## 5. Border policy

No visible border system.
If a border is necessary for a control, keep it near invisible:
- `border border-black/[0.04]`

## 6. Motion

Use only:
- `transition-all duration-200 ease-out`
- `transition-opacity duration-200 ease-out`
- `transition-transform duration-200 ease-out`

No springy behavior in shell chrome.

## 7. Spacing

Premium spacing defaults:
- outer x: `px-6` or `px-8`
- outer y: `py-5` or `py-6`
- section gaps: `gap-6`, `gap-8`, `gap-10`
- panel internal padding: `p-5`, `p-6`

If the page feels tight, increase spacing before adding style.

## 8. Typography rules

- value metrics: large, bold enough to anchor, tight tracking
- section labels: small uppercase with generous letter spacing
- support text: lighter and quieter than normal UI
- avoid medium-weight overload

## 9. Final shell principle

The shell should disappear.
The money value, graph, and key rows should do the talking.
