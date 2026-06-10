# Merge Members — Metrics Plan

Generated: 2026-06-09

---

## KPIs this plan connects to

| Priority  | KPI                                                                   | Target      |
| --------- | --------------------------------------------------------------------- | ----------- |
| Primary   | # of users merged by CSMs/Support                                     | Reduce to 0 |
| Secondary | # of support tickets related to silent app deployment (ratio per org) | Reduce %    |
| Secondary | # of accepted suggested merge recommendations                         | Increase    |

**Known gap:** The primary KPI data source is unknown — no confirmed tracking in Metabase or Redshift. Needs alignment with Lucas or CS before this plan is final.

---

## Metrics

### Metric 1 — Merge suggestion conversion rate

**KPI:** # of accepted suggested merge recommendations

**Definition:** % of organizations with ≥1 active merge suggestion in a given month that confirm at least one suggestion-driven merge during that same month.

```
Numerator:   orgs where ≥1 merge confirmed with source = 'suggestion'
Denominator: orgs with ≥1 active merge suggestion
Window:      rolling 30 days
Granularity: org-level
```

**Human outcome → behavior → event:**
Admins act on suggestions before the grace period expires → `merge_confirmed` fires with `source: suggestion`

**Buildability:** Buildable now — confirm `merge_confirmed` exists in Redshift and carries a `source` property. If `source` is absent, the metric still works but won't isolate suggestion-driven merges from manual ones.

**Tool:** Metabase

---

### Metric 2 — Median days: suggestion surfaced → merge confirmed

**KPI:** Supporting signal for Metrics 1 and 3 — faster resolution = less window for CS to get pulled in

**Definition:** For all confirmed suggestion-driven merges, the median number of days between suggestion creation and merge confirmation.

```
Population: confirmed merges where source = 'suggestion'
Statistic:  median (not mean — outliers inflate badly)
Window:     trailing 90 days
```

**Human outcome → behavior → event:**
Admins stop letting suggestions sit for weeks → gap between `suggestion_created_at` and `merge_confirmed_at` shrinks post-launch

**Buildability:** Buildable now — confirm both timestamps exist on the merge record.

**Tool:** Metabase

---

### Metric 3 — Manual merge completion rate

**KPI:** # of users merged by CSMs/Support → 0 (design-side lever)

**Definition:** % of manual merge modal sessions where the admin confirms a merge.

```
Numerator:   sessions where manual_merge_confirmed fires
Denominator: sessions where merge_member_modal_opened fires
Session:     same admin within 30 minutes
Window:      rolling 30 days
```

**Human outcome → behavior → event:**
Admin resolves a duplicate the suggestion engine missed without calling support → `manual_merge_confirmed` fires

**Buildability:** Requires instrumentation — see below.

**Tool:** Metabase

---

## Qualitative signals

- **Hotjar** — recording filter on Members page + merge modal sessions. Look for hesitation before confirmation, repeated modal re-opens, rage clicks on the Merge member button.
- **Support tickets** — monitor volume tagged `duplicate-member` or `merge`. A drop post-launch is the qualitative signal the redesign is working.

---

## Instrumentation required

Two new Segment events needed for Metric 3. Verify neither exists under a different name before instrumenting.

| Event | Properties | Fires when |
|---|---|---|
| `merge_member_modal_opened` | `org_id`, `admin_user_id`, `trigger: 'manual_button'` | Admin clicks Merge member in the Members page header |
| `manual_merge_confirmed` | `org_id`, `admin_user_id`, `source_member_id`, `dest_member_id` | Admin clicks "Merge and delete duplicate" in the manual merge modal |

---

## Baseline plans

| Metric | Baseline approach |
|---|---|
| 1 — Conversion rate | Pull trailing 90 days before launch. Record monthly average. Use identical query post-launch — do not change filters. |
| 2 — Latency | Pull trailing 90 days before launch. Record median + p25/p75. Any change to population filter invalidates the comparison. |
| 3 — Manual completion rate | No pre-launch baseline possible (button is new). Establish 30-day post-launch baseline, then use as reference for future iterations. |

---

## Nullbert prompts

### Metric 1 — Conversion rate

```
Show me the merge suggestion conversion rate for the last 30 days.

Define it as: the % of organizations that had at least 1 active merge suggestion
and confirmed at least 1 merge where the merge source is 'suggestion' during
the same 30-day window.

Return:
- Total orgs with at least 1 active suggestion
- Total orgs that confirmed at least 1 suggestion-driven merge
- Conversion rate as a %

Filter to active orgs only. Exclude trial and churned accounts.
```

**Post-query:** If the denominator looks low, the `source = 'suggestion'` filter may not exist yet. Remove it, rerun, and flag to eng to add the property to the merge record.

---

### Metric 2 — Latency

```
Show me the median number of days between when a merge suggestion was created
and when the corresponding merge was confirmed, for all confirmed merges
in the last 90 days where the merge was initiated from a suggestion.

Return:
- Median days
- p25 and p75
- Total confirmed merges used in the calculation

Exclude same-day suggestion + confirmation (likely test or internal merges).
```

**Post-query:** The p25/p75 spread tells you as much as the median. If the pre-launch median is above 7 days, that's your benchmark to beat.

---

### Metric 3 — Manual completion rate

*Pending instrumentation. Once events are flowing to Redshift:*

```
Show me the manual merge completion rate for the last 30 days.

Define a session as: a merge_member_modal_opened event and a
manual_merge_confirmed event fired by the same admin user_id within 30 minutes.

Return:
- Total modal opens
- Total completed merges
- Completion rate as a %

Filter to org admins only.
```

**Post-query:** If the rate is below 50%, pull a Hotjar recording filter on sessions containing `merge_member_modal_opened` to see where admins are dropping off in the modal.

---

## Action items

| Action | Owner | When |
|---|---|---|
| Verify `merge_confirmed` exists in Redshift with a `source` property | Analytics / eng | Before launch |
| Pull baseline for Metrics 1 and 2 | You / analytics | Before launch — record in Jira or this doc |
| Add instrumentation events to eng handoff | You | At handoff |
| Clarify where "# of merges done by CSMs/Support" is tracked | Lucas / CS | Week of Jun 9 call |
