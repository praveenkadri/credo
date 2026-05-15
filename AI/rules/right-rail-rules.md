# Right Rail Rules

The right rail owns next-step guidance and contextual controls.

It should not become a second dashboard.

## Use right rail for

- one primary next step
- filters
- small operational context
- short reminders
- related actions
- concise guidance

## Do not use right rail for

- long checklists
- multiple equal CTA buttons
- duplicate actions already shown in the main content
- dense filter lists when there is no data
- marketing-heavy content

## One-action rule

The right rail should usually show exactly one primary action.

| State | Primary action |
|---|---|
| No company | Add company |
| Company exists, setup incomplete | Complete setup |
| Company setup complete, no employee | Add employee |
| Employee exists, payroll incomplete | Complete payroll setup |
| Payroll ready, no run | Run payroll |
| Payroll run exists | Review payroll |
| Documents exist | View documents |

Secondary guidance can be one muted sentence.

Example:

```txt
Payroll and documents appear as your workspace becomes active.
```

Do not show two or three large equal buttons.

## Filter rails

Filter rails are allowed on pages with real records or meaningful filtering.

For empty data pages:
- reduce filters
- hide advanced filter lists
- avoid long static lists
- never let the right rail feel heavier than the main workspace
