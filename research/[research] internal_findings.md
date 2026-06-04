# Internal Findings — Merge Members

Sources: Slack, Fireflies meetings, Google Drive
Compiled: 2026-05-18

---

## Known Bugs (open or recently fixed)

| Jira | Status | Issue | Source |
|------|--------|-------|--------|
| HUB-15482 | In review | Suggested merges re-surfacing already-merged UPN accounts as candidates | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |
| HUB-16115 | Coming up | Merge recommendations include client agents from uninstalled devices (not filtered) | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |
| HUB-16035 | Coming up | Unusual activities not copied over when merging accounts | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |
| HUB-14896 | Shipped | Merge + uninstall buttons on Computers page were disabled/broken | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |
| HUB-15968 | Waiting release | Billing status column was missing on merge members page | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |
| HUB-13348 | Shipped | UX: only checkbox was clickable to select a member — fixed to full row | [#productivity Apr 12 — Lucas](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779) |

Also: uninstalled computers still showing in the manual merge list (not just recommendations) — confirmed as same bug, different entry point. [#productivity Mar 13 — Lucas + Hugo](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1773412233674359)

---

## UX / Product Problems

### 1. Discoverability
- Admins don't find the Merge members page. Lucas: *"it's a big problem — we don't know how they are using it, just that they are having problems."* — [Group DM Mar 4](https://netsoftllc.slack.com/archives/C0AKEC8AFU0/p1772637216071099)
- Page is buried under the Members tab as a secondary tab, disconnected from the Silent App section.
- Action item from kickoff call: *"Explore UI improvements to increase discoverability of the merge members feature on the computers page"* — [Fireflies: Kick off call — Computers + Ignored members, Apr 23, 51:18](https://app.fireflies.ai/view/Kick-off-call-Computers-Ignored-members::01KPR2ZGEHFCQZ5DGTNR0VHE0B)

### 2. Merge recommendations are low coverage
- Lucas: *"The good ones that are there are reliable. The problem is it doesn't catch many."* — [DM May 11](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529584588919)
- Matching relies primarily on email/UPN — limited signals, misses many real duplicates. — [Fireflies: Silent app - Computers page and merge members, Feb 20](https://app.fireflies.ai/view/Silent-app-Computers-page-and-merge-members::01KHXQH9CH3SN3SGBR7WQ36JXM)
- Real-time suggestions not implemented yet (HUB-12739, still to do) — [#productivity Apr 12](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779)

### 3. No proactive notification for pending merges
- Admins are not alerted when there are accounts in grace period or new merge suggestions. — [DM May 11 — Victório](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529464184279)
- Discussion in progress: weekly email digest on Monday morning since grace period is 16 days → admin would get at least 2 emails per suggested merge. — [DM May 11 — Lucas](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529792474809)
- Concern raised: reliability of suggestions needs to be high before sending email at scale. — [DM May 11 — Victório](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529464184279)
- Lucas mentioned this email should follow the "smart notifications" template — [DM May 11 — Victório asking](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778531910832989)

### 4. 24h delay on merge action
- Kate (CS/CSM): *"reduce 24h delay for merge members and allow the action to be available on demand."* — [DM Kate → Victório, Feb 25](https://netsoftllc.slack.com/archives/D09QGHANCKD/p1772038768172819)

### 5. Merge eligibility is unclear in the UI
- Account types (silent vs standard) are not clearly visible during the merge flow, causing merge errors. — [Fireflies: Silent app/Computers brainstorm, Feb 13, 00:44 — Orlin](https://app.fireflies.ai/view/Silent-app-Computers-brainstorm::01KH9RSPS36ZAB9P5WYS3R7FZA)
- Clarifying what can and can't be merged was an explicit action item for Victório + Dmitry. — [Fireflies: Silent app - Computers page and merge members, Feb 20, 12:43](https://app.fireflies.ai/view/Silent-app-Computers-page-and-merge-members::01KHXQH9CH3SN3SGBR7WQ36JXM)

### 6. Admin panel limitations
- Kate: *"admin panel limitation — consider improving current constraints to make the merge flow more flexible."* — [DM Kate → Victório, Feb 25](https://netsoftllc.slack.com/archives/D09QGHANCKD/p1772038768172819)
- Specific constraints not fully documented — Kate linked threads in `#silent-app-issues` in the same DM.

### 7. Business impact of unmerged accounts
- Each unmerged silent user becomes a billable seat. Lucas: *"generates a billable seat, upsets the customer, leads to refund requests."* — [DM May 11](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529584588919)
- This is the core driver for improving auto-merge and notification coverage.

---

## Strategic / Direction Notes

- **Long-term vision:** The Merge members page should shrink as automation improves. Lucas: *"ideally we wouldn't even have it, or scale it down in the future."* — [Group DM Mar 4](https://netsoftllc.slack.com/archives/C0AKEC8AFU0/p1772637216071099)
- **ActivTrak reference:** Lucas flagged ActivTrak's "Next Gen User Management" as likely their equivalent — *"this is likely about the new merge member experience that we should review before improving ours."* — [#-dev-productivity Apr 29](https://netsoftllc.slack.com/archives/C02U1DT4VTM/p1777483698580159)
- **Competitors to benchmark:** ActivTrak and Insightful flagged as main references. Lucas: *"pode começar olhando competitors como fazer. especialmente ActivTrak e Insightful."* — [DM Apr 27](https://netsoftllc.slack.com/archives/D09PR9BS887/p1777312640195349)
- **Page architecture still open:** Discussion on keeping Computers and Merge Members separate vs. consolidating around the Members page — not resolved. Cody and Jared reportedly have a vision to centralize around Members. — [Group DM Mar 3 — Victório to Cody](https://netsoftllc.slack.com/archives/C0AKEC8AFU0/p1772573345067179)

---

## What's Been Shipped (context)

All sourced from: [#productivity Apr 12 — Lucas full update](https://netsoftllc.slack.com/archives/GN6QQ5LNN/p1776050295457779)

- Auto merge via UPN matching — always on, `corporate_provisioning_matching` flag removed (HUB-13870)
- Team memberships carry over during merge, with role upgrade logic (HUB-11331)
- Standard user added to default tracking policy on merge (HUB-13468)
- Auto tracking policy created correctly when merging via UPN (HUB-15481)

---

## Open Questions

- How do admins currently discover the Merge members page? (no analytics confirmed yet)
- What are the specific admin panel constraints Kate referenced? (follow up in `#silent-app-issues`)
- Should the weekly email use the "smart notifications" template? — [DM May 11 — unresolved](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778531910832989)
- One email per suggestion vs. weekly digest — still open per Lucas — [DM May 11](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529792474809)
- Is there existing Hotjar data on Merge members usage? — flagged in [Fireflies: Productivity design sync, Feb 24, 28:05](https://app.fireflies.ai/view/Productivity-design-sync::01KJ8GD6GQ9PA99XN3PDZXJK5E)

---

## Fireflies Meetings Referenced

| Meeting | Date | Link | Key timestamp |
|---------|------|------|---------------|
| Kick off call: Computers + Ignored members | Apr 23 | [Fireflies](https://app.fireflies.ai/view/Kick-off-call-Computers-Ignored-members::01KPR2ZGEHFCQZ5DGTNR0VHE0B) | 51:18 — discoverability action item |
| Silent app: Computers + Merge members | Mar 2 | [Fireflies](https://app.fireflies.ai/view/Silent-app-Computers-Merge-members::01KJQTAK8N8NSD2QG1RJJX62AC) | 12:43 — merge eligibility; 32:53 — merge page redesign |
| Silent app - Computers page and merge members | Feb 20 | [Fireflies](https://app.fireflies.ai/view/Silent-app-Computers-page-and-merge-members::01KHXQH9CH3SN3SGBR7WQ36JXM) | Full session on duplicate detection + notifications |
| Silent app/Computers brainstorm | Feb 13 | [Fireflies](https://app.fireflies.ai/view/Silent-app-Computers-brainstorm::01KH9RSPS36ZAB9P5WYS3R7FZA) | 00:44 — Orlin on account type clarity; 01:16 — analytics ask |
| Productivity design sync | Feb 24 | [Fireflies](https://app.fireflies.ai/view/Productivity-design-sync::01KJ8GD6GQ9PA99XN3PDZXJK5E) | 18:00 — merge user management approach |
