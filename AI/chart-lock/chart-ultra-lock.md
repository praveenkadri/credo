# Chart Ultra Lock — Wealthsimple Reference Enforcement

This chart is a **locked reference component**.

It must behave and appear like a Wealthsimple-style portfolio graph.

---

## 1. Absolute Rule

The chart must NOT be interpreted or redesigned.

It must be implemented as a **fixed system**, not a flexible UI component.

---

## 2. Chart Role

This is a **hero financial graph**, not a dashboard widget.

It must:

* dominate the page
* feel like the primary instrument
* not sit inside nested cards
* not blend into the surface

---

## 3. Layout Rules

The chart section must include:

1. Large primary value
2. Secondary delta (daily change)
3. Graph
4. Range selector (below graph)
5. Mode toggle (Value / Returns)

Order is strict.

---

## 4. Graph Behavior Rules

On hover:

* show vertical guide line
* show active point (filled circle)
* line before = strong color
* line after = faded
* update value dynamically

Hover must:

* feel smooth
* feel precise
* not flicker
* not jump

---

## 5. Line Rendering Rules

The graph line must:

* be thin (1.5–2px)
* use muted semantic green
* not use grey-only line
* not use bright neon green

Split rendering:

* left of hover = full opacity
* right of hover = ~30–40% opacity

---

## 6. Fill Rules

Area fill must:

* exist only under active portion
* be dotted or lightly textured
* fade downward
* be extremely subtle

Must NOT:

* be solid gradient
* be flat color block
* overpower the line

---

## 7. Tooltip Rules

Tooltip must:

* be compact
* be anchored to point
* show:

  * value
  * timestamp

Style:

* small (text-xs)
* white background
* subtle shadow
* rounded-lg

Must NOT:

* stretch
* float randomly
* clip
* look like default chart library tooltip

---

## 8. Color Rules

Allowed:

* muted green (primary)
* subtle neutral greys

Not allowed:

* blue
* purple
* neon green
* multi-color lines

---

## 9. Anti-Patterns (Hard Fail)

If any of these appear, implementation is wrong:

* chart inside a card inside another card
* thick stroke line
* no hover interaction
* static graph
* bright gradient fill
* no active point
* generic analytics tooltip
* grid-heavy background

---

## 10. Final Rule

If the chart does not look like a **financial instrument UI**, it must be reworked.

It must never look like a generic dashboard chart.
