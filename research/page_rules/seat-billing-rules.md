# Seat & Billing Rules — Members Page

Research compiled from Slack (#proj-silent-app-v4-0, #product-department, #t2-escalations), Google Drive specs, and internal discussions.

---

## How billing is calculated

- Billing is based on member count **at the start of each billing cycle**.
- All members count as paid seats **by default**, except those in specific free/exempt states.
- When members are removed mid-cycle: open seats stay until the **next billing cycle starts** (no prorated credits — per Remove Proration spec).
- New seats added mid-month: billed retroactively from the start of that cycle (monthly plans) or from the date of addition (quarterly/yearly plans).

---

## Seat states

### 1. Paid
A normal member occupying a billable seat. This is the default for any member that does not meet a free or grace-period condition.

### 2. Free (Project Viewer)
A member who **does not count toward billing**. For SGT plans, this applies when any of the following is true:

| Condition | Notes |
|---|---|
| Role = **Project Viewer** + assigned as viewer on every project | Most common free path |
| `view_only` flag enabled + user role | Less visible; same billing outcome |

**For older/legacy (non-SGT) plans:** additional configurations may also result in a non-billable seat.

> **Important:** If a Project Viewer is bumped to "User" role (e.g. by a mass project assignment), they become billable **immediately** — there is no grace period for this action. (Source: #cx-sales-internal-support, May 2026)

### 3. Grace Period / Unpaid (Silent App only)
A **temporary free state** for members provisioned via the Silent App. Requires the `corp_app_members_billing_grace_period` feature flag to be enabled on the org.

**How it works:**
- New silent-provisioned users are flagged with an `exempt_from_billing` marker.
- Default duration: **16 days** from the timestamp of provisioning (configurable in org settings).
- During the grace period: the user is **excluded from billing** and does **not occupy a seat**.
- If the user is merged with an existing member within 16 days → **no billing applied**.

**When grace period expires:**
- The exemption flag is removed.
- A daily background job pushes a billing update to Stripe.
- If the user is still "countable" (not removed, not a project viewer) → they re-enter billing.
- If open seats are available → they occupy one of them.
- If no open seats → a new seat is added and charged.

**back_charge setting:**

| Setting | Behavior |
|---|---|
| `back_charge: false` *(default)* | Billing starts from the **end** of the grace period |
| `back_charge: true` | Attempt to charge retroactively from the **start** of the grace period |

- Default: `back_charge: false`, `grace_period_duration: 16 days`
- Recommended usage: `back_charge: false`, duration as short as practical (e.g. 5 days) to minimize revenue loss.
- Back-charge is capped at the number of seats updated during the grace period end event.

**Grace period does NOT apply to:**
- Manually added members (non-silent app provisioning).
- Members role-changed from Project Viewer to User (billable immediately).
- Fixed-contract/enterprise orgs not on per-seat billing (grace period concept is irrelevant; do not show grace period UI to these orgs).

---

## Current UI state vs. what's needed

**Current Members page shows:** Paid / Occupied

**The problem:** "seats occupied" is expected by users to mean billable seats, but Project Viewers are included in member count without consuming a seat — causing confusion between total members, occupied seats, and the actual invoice.

**Proposed 3 billing statuses** (confirmed by Jean + Victório in #product-department, Jun 8 2026):

| Status | Who it applies to |
|---|---|
| **Paid** | Normal billed seat |
| **Grace period** | Silent app member in 16-day exemption window |
| **Free** | Project Viewer (or view_only flag) |

Jean's note: billing column should be available to **all orgs**, not just silent app orgs. Currently it's hidden by default for non-silent app orgs, but everyone benefits from the visibility.

Cody's note (Jun 9): consider keeping "Project Viewer" as the label (not just "free") and add "(free)" next to it so the meaning is clear. Also verify that changing current "paid/occupied/open" language doesn't create confusion for users who've already learned it.

---

## Feature flags (reference)

| Flag | Purpose |
|---|---|
| `corp_app_members_billing_grace_period` | Enables grace period logic + billing status visibility for silent app orgs |
| `merge_members_ui` | Shows the Merge Members tab on the Members page |
| `corporate_provisioning_matching` | Auto-matches SCIM-provisioned users with silent app users |

---

## Sources

- [Prod spec: Merging duplicate members](https://docs.google.com/document/d/1JVy8RUlDjEx98WJUcLCm8_WCIm-veHcBSJ8rs4mkzOQ) — Kate Kamianets
- [Prod spec: Remove proration](https://docs.google.com/document/d/1QHyua5OOFfKeSoLNv4Jo1gTM-GfuYC9w1xm2WH8rKow) — Cody Rogers
- #proj-silent-app-v4-0 — Nikolai Privalov (Jul 25, 2025): grace period live in prod
- #product-department — Jean + Victório thread (Jun 8, 2026): billing column scope
- #cx-sales-internal-support — Mercy Mwende (May 2026): no grace period for role changes
