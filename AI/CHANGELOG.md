# AI Folder Cleanup Changelog

This AI folder replaces the previous large/conflicting rule set.

## Removed/conflict sources

The old folder contained many overlapping files such as:
- multiple WS enforcement files
- chart lock files
- sidebar/topbar/right-rail files with narrow local rules
- older typography rules
- duplicate drift guards
- old prompt templates

Those were consolidated into one cleaner source of truth.

## New structure

- `AI/agent.md` — top-level directive
- `AI/agent-read-order.md` — exact read order
- `AI/design-system/credo-design-system.md` — primary design system
- `AI/design-system/credo-tokens.css` — suggested token values
- `AI/rules/*` — focused implementation rules
- `AI/checklists/*` — QA/security checklists
- `AI/reference/nivo-ws-reference.md` — reference only
- `AI/codex-apply-prompt.md` — copy/paste prompt for Codex

## New priority

Credo now uses:

> Nivo brand confidence + Wealthsimple calm + WaveApps business utility.

Main correction:
- hide irrelevant modules instead of creating empty pages
- remove main-body instructional text
- keep one right-rail next step
- keep Overview calm
