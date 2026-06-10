# Merge Recommendation Rules

How the system detects and surfaces duplicate member suggestions.
Sources: `app/actions/client_agents/refresh_merge_recommendations_action.rb`, `lib/queries/merge_members/recommendations.rb`, `app/models/client_agent_merge_recommendation.rb`.

---

## What triggers a suggestion

A suggestion is generated when a **Silent App (corporate-provisioned) user** matches an existing **standard user** in the same org. The system runs a daily background job (`ClientAgents::RefreshMergeRecommendationsJob`) and checks four matching signals in order:

| Signal | Logic | Notes |
|---|---|---|
| **Exact name** | `LOWER(silent_app_user.full_name) = LOWER(standard_user.name)` | Case-insensitive |
| **OS username** | `user_org.config['os_username'] = client_agent.os_username` | Used for SCIM-synced accounts |
| **Levenshtein distance** | Edit distance between names < 4 characters | Catches typos and minor variations |
| **Principal name (UPN)** | Acts as a safety gate, not a match signal | Prevents false positives across enterprise directory users |

### UPN safety gate
If the source (Silent App) user has a principal name, the system only allows the suggestion if the target standard user either has no identity signals at all, or shares at least one matching signal (UPN or SCIM os_username). This prevents merging two different enterprise directory people who happen to share a display name.

---

## Direction is always one way

```
Silent App user (corporate-provisioned)  →  Standard user (human-created)
       "from" / duplicate                        "to" / kept after merge
```

The reverse is never suggested. Standard users cannot be the "from" side.

---

## Filters applied before a suggestion is created

- Both users must be in the same org and have `Active` status
- The standard user must have been created **before** the Silent App user (older ID)
- Maximum of **50 suggestions** per org per refresh run

---

## Sorting / presentation order

Suggestions are ordered to surface the most urgent ones first:

1. Billing-exempt members first (grace period not yet expired)
2. Least time remaining in grace period (most urgent billing deadline)
3. Newest recommendations last

---

## Suggestion statuses

| Status | Meaning |
|---|---|
| `pending` | Generated, awaiting action |
| `rejected` | Admin/user declined — not re-suggested |
| `confirmed` | Merge was executed (kept for audit) |

---

## What happens on merge

Executed async via `ClientAgents::MergeJob` (~5–30 minutes):
- All time logs, activity, and device associations move from the duplicate to the main profile
- The duplicate user is removed from the org
- If merged within the grace period → no billing applied for the duplicate

---

## Feature flags

| Flag | Purpose |
|---|---|
| `corporate` | Org must have this to generate suggestions |
| `corporate_provisioning_matching` | Enables auto-matching during provisioning (before a duplicate is even created) |
| `merge_members_ui` | Shows the Merge members tab to end users |

---

## Key design implications

- **No ML/scoring** — matching is fully deterministic; a pair either matches or it doesn't
- **Billing urgency drives order** — the UI should reinforce the countdown prominently
- **Rejected pairs are permanent** — the system never re-suggests a declined pair, so declining is a meaningful action worth a confirmation or warning
- **Grace period is the window** — the primary call to action is always to merge *before* the 16-day window closes; after that the seat is charged regardless
