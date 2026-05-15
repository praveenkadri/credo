# Progressive Navigation Rules

Credo should not expose every module from day one.

For a new or quiet workspace, the sidebar should only show what is useful.

## Always visible

- Overview
- Companies

## Team / Employees

Show only when:
- `employeeCount > 0`
- OR current route is `/team` or `/employees`
- OR current route is an employee create/edit flow

Do **not** show Team just because a company exists.

## Payroll

Show only when:
- `employeeCount > 0`
- OR `payrollRunCount > 0`
- OR `payrollSetupStarted === true`
- OR current route is `/payroll`
- OR current route is the run payroll flow

Do **not** show Payroll just because setup is incomplete.

## Documents

Show only when:
- `generatedDocumentCount > 0`
- OR `payrollRunCount > 0`
- OR current route is `/documents`

Do **not** show Documents just because a company exists.

## Insights

Show only when:
- `payrollRunCount > 0`
- OR `generatedDocumentCount > 0`
- OR `meaningfulActivityCount > 0`
- OR current route is `/insights`

Do not show Insights for empty workspaces.

## Compliance

Show only when:
- `complianceTaskCount > 0`
- OR `taxDetailsExist === true`
- OR `payrollComplianceSetupStarted === true`
- OR current route is `/compliance`

Do not show Compliance just because setup is incomplete.

## Conservative rule

If exact counts do not exist, derive them conservatively from actual workspace data.

Conservative means:
- if unsure, hide the module
- except when the user is already on that route

## Static data rule

Do not treat demo/filter labels as real data.

Examples that should not unlock modules:
- Northline
- Willow
- Harbor
- Maya Chen
- Jonas Patel
- static filter arrays
- mock fallback records

## Manual route rule

If the user manually visits a hidden route, do not break the app.

Preferred behavior:
- render the page
- temporarily show the active route in the sidebar
- do not permanently unlock the module for empty workspaces
