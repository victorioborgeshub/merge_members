# Merge Members — Working Context

Living doc. Captures decisions, open questions, ideas, and provocations as the spec + prototype evolve.
Add to each section freely — don't clean up, just append with a date.

---

## Decisions

> Things we've locked or agreed on. Add source/date when possible.

### Added 2026-05-28

- **Work email lives inside the Member column, not as a standalone column.** The email is displayed below the member's name in the same cell — name on top, email below in muted text. This removes "Work email" as a separate column entirely. This is a deliberate departure from the current Hubstaff Members page, which has Work email as its own column. Rationale: email is identity information, not a data point users scan independently. Pairing it with the name reduces cognitive load and saves horizontal space for columns that carry more decision-making weight.
- **Account type column added.** New pill column: silent / standard / scim / sso. Surfaces the account origin directly in the table so admins can identify silent accounts without opening a member detail. Currently not present in the production Members page.
- **Status renders as a pill only — no dot.** Color + copy carry the meaning. Active: green. Inactive: gray. Grace: amber. Invited: blue.

### Added 2026-05-27

- **No separate Merge Members page.** Merge becomes a capability that lives on the Members page, not a standalone destination. The existing page is already buried and disconnected — adding another layer makes it worse.
- **Summary cards on top of Members page.** Four metrics to surface immediately on load: seats occupied, people working (= active seats in the org), merge suggestions pending, members in grace period. Each card is clickable and drills down.
- **Modal for the merge action.** When an admin clicks a merge suggestion, a modal opens — not a redirect to a separate page. Members page stays in context underneath.
- **Left-to-right merge layout inside the modal.** Left = source (silent/unmatched user, gets removed). Right = destination (existing member, survives). Framing: "We suggest merging A into B." Admin confirms or dismisses.
- **Improve the Members page holistically, not just bolt on cards.** Cards alone on a confusing page = visibility without usability. The redesign should treat Members as a coherent surface that owns two jobs: insight (seats, health, billing) + management (invite, deactivate, roles). Doing both together avoids shipping a bandage and paying the redesign debt later.
- **Start with the utopian prototype.** Before scoping down, prototype the ideal Members page experience — no constraints. Show it to Lucas (PM) and Victório (design manager) to align on direction, then tear it down together into what's actually shippable. This is the deliberate process: vision first, scope second.
- **Use AI to move faster and make bolder decisions.** The prototype can be built in hours. The goal is to show stakeholders a real, clickable vision — not slides — and use that as the basis for scoping conversations.

### Carried from prior research

- **Scope is admin-facing.** The merge flow is for org admins only — not managers.
- **The core problem is discoverability + automation gap.** Admins don't find the page; when they do, auto-suggestions miss too many duplicates.
- **Long-term direction: the page should shrink.** As automation improves, manual merges should become rare. Design should not over-invest in the manual flow at the expense of the automated path. (Lucas, Mar 4)
- **Hubstaff already has a competitive edge: merge recommendations exist.** No competitor has them. Design should lean into this — it's the clearest differentiation.
- **Notifications require high suggestion reliability first.** Sending email at scale before quality is high enough = trust problem. (Victório + Lucas, May 11)
- **Weekly email digest is the current proposal for proactive alerts.** Monday morning, 16-day grace period = admin gets at least 2 emails per suggestion before deadline. Not finalized. (Lucas, May 11)
- **Merge states to design for: Pending → In Progress → Complete (+ Cancelled, + Failed).** Duration and cancellability still need eng input before wireframing.
- **Concurrency rule (proposed):** allow parallel merges as long as no member appears in two active merges simultaneously. Block selection in the UI.

---

## Open Questions

> Things blocking design decisions. Tag with [ENG], [PM], [CS], or [DESIGN] to show who needs to answer.

### Engineering dependencies

- [ENG] **Is the 24h delay a technical requirement, a safeguard, or batch-processing artifact?** Kate (CS) flagged this as a pain point. Answer determines whether we need an async feedback loop or just a loading state.
- [ENG] **Can the source member be edited during a merge?** Likely no — but needs confirmation.
- [ENG] **Does the source member disappear from UI immediately or only after completion?** Disappearing early + failure = confused admin.
- [ENG] **Can the destination member be edited during a merge?**
- [ENG] **Are time entries, screenshots, and activity accessible on both records during the merge process?**
- [ENG] **Does billing change on merge start or on completion?**
- [ENG] **Is failure a possible outcome of a merge? What does recovery look like?**
- [ENG] **Concurrency: what's the real constraint?** Sequential only, or parallel with exclusivity rule?

### Product / strategy

- [PM] **What are the specific admin panel limitations Kate referenced?** She linked threads in `#silent-app-issues` — not yet pulled in.
- [PM] **Is there existing Hotjar data on Merge Members usage?** Flagged Feb 24 — never confirmed.
- [PM] **One email per suggestion vs. weekly digest?** Lucas left it open (May 11).
- [PM] **Should the weekly email use the "smart notifications" template?** Lucas mentioned this but didn't confirm. (May 11)
- [PM] **Page architecture: keep Computers + Merge Members separate, or consolidate around Members?** Cody and Jared reportedly have a vision to centralize — not resolved. (Group DM Mar 3)

### Design

- [DESIGN] **How do we surface account type (silent vs. standard) clearly during the merge flow?** Orlin flagged this as causing errors — unclear account types lead to merge mistakes. (Feb 13)
- [DESIGN] **What does the source member look like in the UI while merging?** "Merging…" state vs. hidden vs. grayed out.
- [DESIGN] **How do we surface the 16-day grace period to admins who don't know it's counting down?**
- [DESIGN] **Multiple suggestions: queue (one at a time) or list first?** Queue is more decisive; list gives more control. Given suggestions are rare and high-stakes, leaning toward list — but not decided. (2026-05-27)
- [DESIGN] **Can the admin flip source and destination in the merge modal?** If the suggestion gets the direction wrong, swapping should be possible. Prevents support tickets. (2026-05-27)
- [DESIGN] **Second step in the merge modal: final confirmation or data-scope preview?** Merges are currently irreversible — showing what will carry over (time entries, screenshots, etc.) might be worth the extra step. Not decided. (2026-05-27)
- [DESIGN] **What is the minimum info needed per side in the merge modal?** Name, email/UPN, last active, billing status seem like the floor. (2026-05-27)

---

## Ideas

> Directions worth exploring. Not committed, not dismissed.

- **Surface merge candidates inline, not in a separate tab.** The current buried-tab pattern is the root of the discoverability problem. Consider surfacing unmatched computers as a callout within the Computers page or as a task in a dashboard-style header.
- **Approval gate as an opt-in prevention mechanism.** Time Doctor has this (off by default). Could Hubstaff offer it as a way to pause billing on new silent users until admin confirms? This would eliminate the duplicate problem upstream — but adds friction for orgs that trust their computers.
- **"Merged" tab as a dedicated state.** Insightful uses this pattern — Active / Deactivated / Merged. Cleaner than burying merge history.
- **Export-to-CSV for manual deduplication.** ActivTrak added this explicitly for IdP comparison. A weak fallback but worth considering for power-user orgs without IdP integration.
- **Surface grace period countdown in the UI.** Most admins don't know the 16-day window exists. A visible countdown (e.g. "X days left to merge without being charged") might drive action better than any email.
- **Agent drawer pattern (ActivTrak NGUM).** Scoping merge to "agents into one user" rather than "user A into user B" may be a cleaner mental model — especially when one person has multiple computers. Worth evaluating against Hubstaff's current user-to-user framing.

---

## Provocations

> Questions designed to challenge assumptions. Hold them lightly.

- **Should the merge flow exist at all, or should we invest in preventing duplicates upstream?** If IdP/UPN matching were better, most merges would never be needed. Is this a band-aid on an enrollment problem?
- **Are merge recommendations trustworthy enough to act on without review?** Lucas: "the good ones are reliable, the problem is it doesn't catch many." If we surface them more aggressively, does false confidence become a bigger problem than low coverage?
- **Who is the real user here — the admin or the CSM?** Some orgs have dedicated IT admins who live in this page. Others have admins who never go near Settings. Are we designing for one or both? The answer changes the UX bar significantly.
- **Is the 16-day grace period a bug or a feature?** ActivTrak gives 30 days. If customers are getting billed unexpectedly and requesting refunds, is the grace period long enough — or is the real issue that they don't know it exists?
- **Would automatic merge (with an undo window) be safer than a confirm-and-wait model?** If suggestion quality is high and merge is reversible within N hours, auto-merge might be lower-risk than it sounds — and it removes the admin burden entirely for the high-confidence cases.

---


## Prototype Notes

> Running log of prototype decisions, direction changes, and feedback received.

### 2026-05-27 — Direction set

**Goal for prototype v1:** Utopian Members page. No constraints, no scoping down yet. Build the ideal experience as if everything were possible.

**What to show:**
- Redesigned Members page with 4 summary cards at the top (seats occupied, people working, merge suggestions, grace period members)
- Merge suggestion modal — left/right layout, source → destination, with enough member info to trust the suggestion
- The page itself should feel like a coherent insight + management surface, not a list with tabs bolted on

**Audience:** Lucas (PM) + Victório (design manager)
**Purpose:** Align on vision, then tear it down together into what's actually shippable in the near term.

**Build approach:** AI-assisted, a few hours. The point is a real clickable prototype, not slides.

---

## Migrating Members to the New Design System

> Added 2026-05-29. A recommendation to consider as part of this project's scope — not a hard requirement.

The Members page currently lives on the legacy design system, which is fragmented, increasingly inconsistent with the rest of the product, and harder to maintain over time. Since this project already requires significant changes to the page — new summary cards, merge capability, account type visibility — there is a natural opportunity to migrate the entire surface to the new design system as part of the same effort, rather than layering new experiences on a foundation that will need to be replaced eventually regardless.

**The timing argument**

The cost of migrating is lowest when a page is already being substantially redesigned. Doing it as a standalone project later means revisiting decisions, rebuilding components a second time, and coordinating a separate round of design and eng work. Folding it into this project absorbs that cost into work that is already scoped and in motion.

**The compounding benefit**

The Members page has historically been a surface that teams are cautious about touching. Several improvements have stalled not because of product priority, but because the legacy foundation made changes feel risky and expensive. A clean migration to the new design system would reduce that friction for every future iteration — not just for this feature.

**The alternative**

If a full migration is out of scope, the alternative is to ship new components on top of the legacy surface. This is a valid path. The trade-off is that the migration cost doesn't disappear — it gets deferred to a future project, at which point the page will likely be more complex and the effort larger. That trade-off is worth making explicitly rather than by default.
