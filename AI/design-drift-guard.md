# Design Drift Guard — Wealthsimple Alignment

This file prevents the UI from drifting into generic SaaS patterns.

## Watch for these drift signals

### Layout drift
- equal card grids
- too many same-weight modules
- dense dashboard arrangement
- no hero hierarchy

### Surface drift
- boxed panels everywhere
- stronger borders than spacing
- deep shadows
- identical support cards

### Chart drift
- blue or grey-only line for positive state
- sparkline look
- no hero value
- no delta
- no active point
- no faded future line

### Typography drift
- too much mid-weight text
- labels too dark
- values too small
- metrics not clearly anchored

## Recovery order
1. remove panel chrome
2. restore whitespace
3. restore hero hierarchy
4. quiet support modules
5. restore chart behavior
6. reduce component count

## Final rule
If a page looks more like a business dashboard than a calm wealth surface, it has drifted.
