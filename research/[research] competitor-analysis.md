# Competitor Analysis — Merge Members / User Deduplication

Compiled: 2026-05-18
Scope: How competitors handle the problem of duplicate/unmatched user accounts created by silent agent installs.

---

## TL;DR — Feature Comparison


|                                       | ActivTrak                                         | Insightful                                       | Time Doctor                                                 |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| In-product merge UI                   | Yes (NGUM: agent drawer; legacy: checkbox select) | Yes (Merged tab + modal)                         | No                                                          |
| Merge initiated by                    | Admin                                             | Admin only (not managers)                        | Support ticket only                                         |
| Merge suggestions / recommendations   | No                                                | No                                               | No                                                          |
| Proactive alert for unmatched users   | No — license overage email only                   | No — silently added to Active tab                | No                                                          |
| Notification when new agent appears   | No                                                | No                                               | No (unless approval gate is enabled)                        |
| Admin approval gate for new users     | No                                                | No                                               | Yes — optional "Review and approve" toggle (off by default) |
| Merge reversible?                     | No (legacy has cancel window before midnight CT)  | No (support can undo on request)                 | N/A                                                         |
| Data preserved after merge            | Yes                                               | Yes                                              | N/A                                                         |
| Billing freed after merge             | Yes                                               | Yes (source no longer billed)                    | N/A                                                         |
| IAM / IdP integration                 | Entra ID native, SCIM beta, HR Connector beta     | Entra ID, HiBob, Workday, Okta (matching screen) | Azure AD workaround only                                    |
| Multi-device without merge (AD users) | Yes — auto-links via UPN                          | Yes — domain\user links across devices           | No — one account per OS profile                             |


---

## How Each Competitor Creates the Problem


|             | Trigger                                                               | What gets created                                             | Admin visibility                                                   |
| ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| ActivTrak   | Agent installs, no email/UPN found                                    | Placeholder record: `username@logon_domain`                   | Silently added to Users list — no alert                            |
| Insightful  | Company computer agent installs, employee logs in with OS credentials | Auto-registered record using HWID + username (or Domain\User) | Silently added to Active tab                                       |
| Time Doctor | Automatic app installs, OS user logs in                               | New billable user record                                      | Silently added — or held in "Pending" queue if approval gate is on |


All four create the duplicate silently. None of them notify the admin proactively.

---

## Merge / Deduplication Flows

### ActivTrak — Next Gen User Management (NGUM, GA March 18 2026)

**Path:** `Settings > Users & Groups > Users` → **Licenses column** (shows agent count) → opens "Agents Associated with [user]" drawer

**Steps:**

1. Find the user — Licenses column shows e.g. "3 agents"
2. Click the link → "Agents Associated" drawer opens
3. Select agents to consolidate via checkboxes
4. Click **"Merge agents"**
5. Check the confirmation warning
6. Merge executes

**Key details:**

- Scoped to one user's record — you're collapsing multiple agents *into* that user, not merging two named users
- No cancel window in NGUM (legacy had an overnight processing window with a cancel option)
- No merge suggestions — admin must find the duplicate manually or via CSV export

**Legacy path (pre-NGUM):** `Settings > User Agents` → select 2+ users → auto-selects destination (most recent activity) → confirmation dialog → processes at **12:00 AM US CT**. Cancel available before that.

**Sources:**

- [Merge Agents (NGUM)](https://support.activtrak.com/hc/en-us/articles/47730849951131-Merge-Agents)
- [User Merge (Legacy)](https://support.activtrak.com/hc/en-us/articles/360059581551-User-Merge)
- [Release Notes: NGUM EA](https://support.activtrak.com/hc/en-us/articles/30747393942171-Release-Notes-Next-Gen-User-Management-Early-Access-EA)

---

### Insightful — Merge Employees

**Path:** `Employees` → **Merged tab** → **"Merge Employees"** button (arrow icon, top-right)

**Steps:**

1. Click "Merge Employees"
2. Modal opens with two fields: **"Merge from"** (source — disappears from Active) and **"Merge into"** (destination — survives)
3. Each field shows team, ID, tracking settings for verification
4. Click **"Merge Employees"**
5. Final confirmation window appears
6. Merge executes

**Constraints:**

- Both employees must belong to the **same team**
- Destination user cannot subsequently be used as a source in another merge
- Multiple sources → one destination is supported
- Irreversible from the UI — requires contacting support to undo (`support@insightful.io`)

**Data consolidated:** time tracked, productivity metrics, app/website usage, screenshots, timesheets, project & task time. Historical activity logs preserve original employee name and computer name.

**Sources:**

- [How to Merge Employee Users](https://help.insightful.io/en/articles/5044798-how-to-merge-employee-users)
- [Employee User Merging: User Data Consolidation](https://help.insightful.io/en/articles/4748506-employee-user-merging-user-data-consolidation)

---

### Time Doctor — Support Ticket Only

No admin-facing merge UI. If data from both duplicate profiles needs to be preserved, admin must:

1. Email **[support@timedoctor.com](mailto:support@timedoctor.com)**
2. Request "a merge of Automatic App user profiles"
3. Specify which profile should remain primary

If data preservation isn't needed, admin can simply archive or delete the duplicate from `Settings > Users`.

**Closest thing to an admin gate:** `Settings > Company Settings > Configuration > "Review and approve new automatic application users"` — toggle, **off by default**. When on, a **"New Automatic Users"** tab appears under `Settings > Users` with **Pending approval** and **Approved users** sub-sections. Billing doesn't start until approval. No notification fires when someone lands in the pending queue — admin must check manually.

**Sources:**

- [Why Do I Have Duplicate Automatic App User Profiles?](https://support.timedoctor.com/knowledge/why-do-i-have-duplicate-automatic-app-user-profiles-in-my-account)
- [Best Practices When Using the Automatic App](https://support.timedoctor.com/knowledge/best-practices-when-using-the-automatic-app)

---

## Admin Notifications — Detailed


| Trigger                     | ActivTrak                                                                                               | Insightful                                     | Time Doctor                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| New unmatched agent appears | None                                                                                                    | None                                           | None (or pending queue if gate enabled) |
| Duplicate user detected     | None                                                                                                    | None                                           | None                                    |
| License limit exceeded      | In-app banner + email to all admins                                                                     | None found — billing is immediate and prorated | None found                              |
| Grace period / billing risk | **30-day grace period** — must add licenses or reclaim within 30 days; resets when count drops to limit | None                                           | None                                    |
| Pending merge reminder      | None                                                                                                    | None                                           | N/A                                                      |


No competitor sends a proactive "you have a duplicate" or "this computer doesn't match any user" notification. The closest thing is **Time Doctor's optional approval gate**, which at least holds new users from billing until an admin acts — but still requires the admin to go looking.

---

## IAM / Identity Provider Integrations


| Provider                   | ActivTrak                                               | Insightful                                       | Time Doctor                       |
| -------------------------- | ------------------------------------------------------- | ------------------------------------------------ | --------------------------------- |
| Entra ID (Azure AD)        | Native — syncs users/groups, auto-deduplication via UPN | Integration available — matching screen required | Workaround only (contact support) |
| Okta                       | SCIM beta                                               | Integration available                            | Not found                         |
| SCIM                       | Beta (Entra ID + Okta)                                  | Not documented                                   | Not documented                    |
| AD (on-prem LDAP)          | Via Entra ID                                            | Import available                                 | Not found                         |
| HRIS (Workday, HiBob, ADP) | HR Data Connector beta (CSV-based)                      | HiBob, Workday                                   | Not found                         |


**Key note:** For all three, AD/Entra ID integration is the primary prevention mechanism — when a user is domain-joined and uses their UPN, the system auto-links them across devices. Without it, duplicates are inevitable and manual.

---

## ActivTrak Deep Dive (Primary Benchmark)

ActivTrak is the most relevant benchmark because they just shipped a major user management overhaul (NGUM, GA March 2026) and are explicitly building toward the same "reduce manual identity work" goal.

### What changed with NGUM


|                     | Legacy (pre-NGUM)                                            | Next Gen User Management                                                 |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Location            | 3 separate pages: User Agents, User Aliases, Do Not Track    | Single **Users page** (`Settings > Users & Groups > Users`)              |
| Merge path          | Select users from list → confirmation → overnight processing | Click Licenses count → Agents drawer → Merge agents                      |
| Cancel merge        | Yes — before 12:00 AM CT processing                          | No                                                                       |
| Duplicate detection | Manual — admin browses list                                  | Manual — but Export to CSV for IdP comparison                            |
| Naming              | "Alias"                                                      | "Display Name" (retroactive rename)                                      |
| Bulk actions        | Technical config options                                     | Job-based: Track, Untrack, Delete User, Delete User and Data, Reset Data |
| User Time Zone      | Not available                                                | Column added March 31, 2026 (when User TZ mode enabled)                  |


### The CSV Export workaround

ActivTrak added an **Export** button to the Users page explicitly to support deduplication: "compare ActivTrak users with Azure AD or other identity systems" and "identify duplicate agents that need to be merged." This is the closest they get to a systematic duplicate-finding flow — but it's a manual export-and-diff, not an automated suggestion.

[Source: Export User Data from the Users Page](https://support.activtrak.com/hc/en-us/articles/40297823621147-Product-Update-Export-User-Data-from-the-Users-Page)

### Grace period

ActivTrak has a **30-day grace period** when the license count is exceeded. Admin receives an in-app banner + email notification. Within those 30 days they must either add more licenses or reclaim existing ones (delete/untrack users). The grace period resets once the count drops back to the purchased limit.

Source: [ActivTrak User and License Management](https://support.activtrak.com/hc/en-us/articles/37189141730587-ActivTrak-User-and-License-Management)

### Shared gaps with Hubstaff

- No merge suggestions or recommendations
- No notification when a new unmatched agent appears
- Merge is always admin-initiated

---

## Key Observations for Hubstaff

1. **Nobody has merge suggestions.** All four competitors require the admin to find the duplicate themselves. This is the clearest gap in the market — and Hubstaff already has recommendation logic, even if coverage is low.
2. **Nobody sends proactive alerts.** Time Doctor's optional approval gate is the closest thing, and it's off by default. An admin who gets notified when a merge candidate appears would have a meaningfully better experience than any competitor.
3. **Insightful has the most polished merge UI.** The source/destination modal with team + ID verification is clean. The "Merged" tab as a dedicated state (separate from Active/Deactivated) is a good pattern.
4. **ActivTrak's NGUM is the benchmark to beat.** Shipping March 2026, consolidating 3 pages into 1, with job-based actions. Their merge is now scoped correctly (agents into one user, not user-to-user). But they still have no automation around it.
5. **Time Doctor is weak here.** No merge UI, no notifications, resolution is email support. Not worth referencing as a positive model.
6. **Grace period: ActivTrak has one, others don't.** ActivTrak offers 30 days to resolve license overages — longer than Hubstaff's 16 days. Insightful and Time Doctor bill immediately or have no documented grace window. The 16-day grace period is still an advantage vs. two of the three, but ActivTrak beats Hubstaff here. If we surface the grace period more clearly to admins, it reduces billing disputes — but ActivTrak's 30-day window is a stronger selling point on paper.

