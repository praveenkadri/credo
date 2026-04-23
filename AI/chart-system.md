# Chart System — Strict Wealthsimple Hero Graph Rules

Use this for primary balance / movement charts.

## 1. Hero status

A primary chart is the page's main instrument.
It is not a widget.

When a primary chart is present:
- it must dominate the main column
- the balance header and delta must feel integrated with it
- surrounding content must step back

## 2. Exact visual structure

The chart region must include:
1. large primary value
2. green or red delta under it
3. open chart field
4. time-range row
5. optional mode toggle on the lower right

## 3. Plot field

The plot field must feel open and embedded.
Use:
- `bg-[#f1f2ef]`
- `rounded-2xl`
- minimal chrome
- very light inset highlight if needed

Do not place the chart inside another inset card with obvious boundaries.

## 4. Line rendering

Positive state:
- thin green line
- elegant, not thick
- around 2px visual weight
- slightly darker before active point
- visibly faded after active point

Line must look like a product chart, not a dashboard line series.

## 5. Fill rendering

Use:
- a soft green-tinted area under the active segment
- dotted or textured feel if the charting library allows it
- fade out toward the bottom
- no solid block fill

If dotted texture is hard, approximate with:
- extremely soft translucent area fill
- low-opacity gradient
- subtle pattern mask

## 6. Hover behavior

Hover must show:
- active point dot
- thin vertical guide line
- stronger pre-hover path
- faded post-hover path
- precise hover label / tooltip

Tooltip / hover label should be:
- compact
- not a balloon
- near-white surface
- small text
- correctly anchored
- unclipped
- free of stretching bugs

## 7. Controls

Timeline controls:
- `1D 1W 1M 3M 6M YTD 1Y ALL` style if the page supports them
- quiet text
- active soft pill
- ample spacing
- lower left placement preferred

Mode toggle:
- `Value / Returns`
- lower right
- subtle soft pill for active state

## 8. Hard anti-patterns

Never allow:
- chart in a heavy card inside a card
- blue line for positive movement
- thick line stroke
- generic analytics tooltip
- no active point
- no faded future segment
- no delta metric above the chart
- dense axis labels
- visible y-axis chrome

## 9. Validation

If the chart does not feel like the strongest, cleanest, most trustworthy part of the page, rework it.
