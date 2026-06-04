# Merge Members



## Problem

Silent App installs create a duplicate account when Hubstaff can't match a new silent user to an existing member. Admins have to resolve this manually, but the experience works against them in three ways:

- **No visibility, no urgency.** There are no alerts or signals when a duplicate appears. Admins don't know there's a problem until they stumble on it — or until the invoice does it for them.
- **Fragmented member management.** The place to act on duplicates is disconnected from where admins actually manage members. The resolution flow pulls them away from their primary workflow instead of surfacing within it.
- **Silent App members are a separate concern.** Accounts created via Silent App are treated as a distinct category, creating a split mental model for admins who manage mixed teams. The context changes depending on which tool was used to onboard someone.

Most admins don't find the resolution path until it's too late, if at all.

---

## Money Story

Every unresolved duplicate is an extra billable seat the customer didn't ask for. They notice it on the invoice, request a refund, and lose trust in the product.

- **Hubstaff:** refund requests and churn risk on Silent App — the add-on we're actively growing. ([Lucas, May 11](https://netsoftllc.slack.com/archives/D09PR9BS887/p1778529584588919))
- **The customer:** duplicate members in reports, split tracking history, unreliable data — and a 16-day grace period they didn't know was counting down.
- **Support & CS:** customers reach out to support or their CSM to resolve what should be a self-serve action — time spent on manual triaging and coordination that adds up across accounts.


---


### How long does a merge take?

There is no 24h delay. The merge is two-phase:

- **Confirmation** — instant. The source member is reassigned to the target, removed from the org, and a merge record is created. This runs synchronously inside an advisory lock + DB transaction.
- **Data copy** — async background job. Copies up to 2 months of historical data (time entries, activity, screenshots), one day at a time, with a 10-second sleep between each daily chunk in production. This can take hours.

From the admin’s perspective the merge “happens” immediately — but data is still moving in the background long after. Kate’s ask for on-demand merge is already true for the action itself; the delay is in the data propagation.

**Open:** Can the data copy window be shortened, or is 2 months a fixed constraint?

---

### Merge states to design for

Based on the code, the current states are `confirmed` → `data_copied`. For the UI, we need to represent:

```
Confirmed → Copying data → Complete
```

And potentially:

```
Confirmed → Cancelled (if we add cancellability)
```

Key questions per state:
- **Confirmed:** The merge has been triggered. Source member is already removed from the org. Can it be cancelled at this point, or is it too late?
- **Copying data:** Background job is running. What does the admin see? Is there a status indicator anywhere?
- **Complete:** What confirmation is shown? Is it reversible? (Currently: no, unless support intervenes.)
- **Failed:** Not accounted for in the current model — no failure state exists. **Open: is failure a possible outcome, and if so, how should the admin recover?**

---

### What can/can’t be done during a merge?

The source member is removed from the org immediately at confirmation. Still needs eng input:

- Does the source member remain visible in the UI as “Merging…”, or does it disappear immediately?
- Can the destination member be edited while data is being copied?
- Are time entries and activity data accessible on both records during the copy phase?
- Does billing change at confirmation or only once data copy completes?

---

### Can you merge another account while one is already in progress?

**Yes — multiple merges can be triggered, but data copy runs sequentially per org.** Only one background copy job executes at a time (1-hour org-wide lock). Additional merges queue up behind it.

**The gap: there is no conflict detection on the destination member.** If merge A→B is in progress and an admin triggers C→B, both are confirmed and queued without any warning. The UI does not block this today.

This is a real edge case to design for. Options:

| Approach | Behavior |
|---|---|
| Block at selection | Disable any member already involved in an active merge from being selected as a destination |
| Warn on confirm | Allow selection but show a warning before confirming |
| Allow silently | Current behavior — no change |

Blocking at selection is the safest UX — it prevents the conflict rather than recovering from it.

---

### Design constraints

1. **Async feedback** — since data copy can take hours, a loading state alone isn’t enough. Admins need a way to know when it’s done (status column, notification, or email).
2. **Source member visibility** — if it disappears from the org immediately at confirmation, admins may be confused if something goes wrong during copy. Clarify with eng what the admin sees post-confirmation.
3. **Cancellability** — not supported today. If we want to add it, it’s only viable before confirmation (the source member is already gone after that).
4. **Conflict prevention** — blocking a member already in an active merge from being selected as a destination needs to be added at the UI and ideally validated on the backend.
