# Zone Questions — Members Page

Open questions about what Zone can or cannot support.

---

## 1. Editable column header

Can we add an interactive control on a column header that lets the user choose which field is displayed in that column's cells?

**Context:** Columns like Info and Employment can have up to 10 fields. The idea is that on hover, the column header shows a pencil icon. Clicking it opens a dropdown where the user picks which field to display in the cells.

**Question:** Does Zone support interactive column headers with a dropdown?

---

## 2. Batch actions

Should we use the blue toolbar that appears above the table on row selection, or a standalone "Batch actions" button above the table?

**Context:** We have up to 9 actions. The blue toolbar may not have enough space to show all of them, or it may hide some behind an overflow menu.

**Question:** How many actions does the Zone blue toolbar support before it overflows? Is a "Batch actions" button above the table a better fit for this volume?

---

## 3. Avatar vs. name — two separate interactions in the Member column

The current Member column has two distinct interactions:

- **Avatar click** — opens a small popover with email, time zone, a link to member profile, and a link to activity
- **Name click** — navigates directly to member profile → Info tab

**Question:** Does Zone support two separate click targets within the same cell (avatar and name independently)? And is it worth preserving this split, or should we simplify to a single interaction for now?

---

## 4. Pencil on hover — per value vs. per cell

Can Zone support a hover state on individual values within a cell (per value), or only on the whole cell?

**Context:** The Payment column has 3 separate values (Pay rate, Bill rate, Frequency), each redirecting to the same page. A pencil on hover per value would give each its own trigger, but since they all go to the same place, per-cell hover may be sufficient and simpler.

**Question:** Can Zone do per-value hover states inside a cell? And is per-cell the right call here given all values redirect to the same destination?
