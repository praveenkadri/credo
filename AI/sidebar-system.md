# Sidebar System — Wealthsimple-Like Rail

## Intent
The sidebar must feel almost invisible compared with the main content.

## Traits
- very light background or no obvious panel at all
- narrow visual weight
- compact icon + label rows
- low-contrast inactive state
- quiet active state
- almost no decorative surfaces

## Suggested classes
Shell:
- `bg-transparent`
- `px-3 py-5`

Nav item:
- `h-11 rounded-xl px-3 text-[15px] font-medium text-[#575b55] transition-all duration-200 ease-out`

Hover:
- `hover:bg-[#f7f7f4] hover:text-[#1f221c]`

Active:
- `bg-[#fafaf7] text-[#1f221c] shadow-[0_1px_1px_rgba(31,34,28,0.02)]`

## Rules
- no boxed sidebar container
- no strong shadow on the rail
- no oversized active pills
- no loud icon treatments
- active row should feel softly placed, not highlighted
