# Design Changes — Merge Members

Dev reference. One section per feature. Each section covers behavior, states, and edge cases for that feature only.

---

## Merge member (manual)

New header button (`btn--outline-primary`) that opens a modal for manually merging any two members. No pre-selected suggestion required.

### Selectors

Two dropdowns at the top of the modal.

- **Merge from** — Silent accounts only.
- **Merge to** — locked until source is selected; shows eligible (non-Silent) members; spinner while filtering.

### Slot / card states

Each column shows a placeholder slot until a member is selected, then swaps to a member card.

**Empty slots**
- Left: `no_accounts` icon · "Duplicate member" · "(to be removed)"
- Right: `account_circle` icon · "Main profile" · "(kept after merge)"

Slot style: `min-height: 146px`, gray-100 bg, 2px dashed gray-300 border, 8px radius.

**Filled cards** — avatar · name · email · account type pill · divider · linked device(s) · OS username · last sign-in.

### Confirm action

Disabled until both members are selected. Label: "✓ Merge and delete duplicate". Style: `btn--amber`.

---

## Merge suggestions

### Summary card

New card on the Members page. Shows count of detected duplicates. "Review" button (`btn--primary`) opens the suggestions modal.

### List view

Table of suggested pairs: Merge from → Merge to · Actions. Each row has a "Review" button (`btn--primary btn--sm`) that opens the detail view.

Empty state when all resolved: "All suggestions have been reviewed."

### Detail view

Same member card layout as manual merge. No slots — both members are pre-filled from the suggestion. "Merge from" card renders at `opacity: 0.6`.

**Footer:** Back (ghost, ←) · Ignore suggestion (ghost, ✕) · Merge and delete duplicate (amber, ✓)

---

## Member card — device display

`linkedTo` is an array. The "Linked to:" row in each card handles all cases.

| Case | Display |
|---|---|
| 1 device, short | `Linked to: MacBook-Air-M2` |
| 1 device, long (>28 chars) | Truncated inline with `…`; full name in `title` tooltip |
| Multiple devices | First device (truncated if long) + `(+N more)` |
| No device | "No computer linked" — italic, muted |

`(+N more)` shows a hover tooltip listing remaining devices, one per line. Names over 50 chars are truncated in the tooltip.
