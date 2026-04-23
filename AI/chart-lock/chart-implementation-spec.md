# Chart Implementation Spec

## Required Structure

```tsx
<ChartSurface>
  <ChartHeader />
  <ChartGraph />
  <ChartControls />
</ChartSurface>
```

---

## ChartHeader

Must include:

* primary value (large)
* daily change (green)
* optional secondary label

---

## ChartGraph

Must include:

* line path
* area fill
* active point
* hover line

---

## ChartControls

Must include:

* timeframe selector
* mode toggle (Value / Returns)

---

## Required Libraries

If using chart lib:

* must support:

  * custom tooltip
  * split path rendering
  * active dot control

If not:

* implement via SVG

---

## Forbidden

* inline random chart code
* multiple chart implementations
* mixing libraries
