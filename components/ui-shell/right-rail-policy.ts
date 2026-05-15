export const RIGHT_RAIL_USAGE_POLICY = {
  useFor: [
    "Payroll and other filter-heavy archives",
    "Documents and other archive/search surfaces",
    "Contextual next actions that support the current page",
  ],
  avoidFor: [
    "Simple list pages",
    "Pages with one clear primary action",
    "Focused create/edit wizard pages",
  ],
  notes: [
    "Companies should stay single-column unless the data model needs heavier filtering.",
    "Employees should use a compact top filter bar before adding a rail.",
    "Right rail is a contextual tool, not a layout requirement.",
  ],
} as const;
