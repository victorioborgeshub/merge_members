# Members Page — Filters

All filters are multi‑select unless noted. No selection = "All" (no filter applied).

| Section      | Filter                 | Type         | Options                                                                                                                          | New design |
| ------------ | ---------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Organization | Role                   | multi‑select | Organization owner, Organization manager, Project manager, Team lead, User, Project viewer                                       | Keep       |
| Organization | Billing Status         | multi‑select | Paid seat, Grace period, Project viewer (no seat)                                                                                | 🟢 New     |
| Organization | Projects / Work Orders | multi‑select | Dynamic — org's active projects and work orders                                                                                  | Keep       |
| Organization | Department ⚠️          | multi‑select | Dynamic — org's departments. **HS People Beta only**                                                                             | Keep       |
| Organization | Account Type           | multi‑select | Silent, Standard, SCIM, SSO                                                                                                      | 🟢 New     |
| Organization | Account Creation       | multi‑select | Manual, SCIM, SSO, Automatic (Silent app)                                                                                        | Keep       |
| Organization | Apps                   | multi‑select | Desktop, Mobile, Silent                                                                                                          | Keep       |
| Location     | Work Country / Region  | multi‑select | Dynamic — from member data                                                                                                       | Keep       |
| Location     | Work State / Province  | multi‑select | Dynamic — depends on selected work country                                                                                       | Keep       |
| Location     | Home Country / Region  | multi‑select | Dynamic — from member data                                                                                                       | Keep       |
| Location     | Home State / Province  | multi‑select | Dynamic — depends on selected home country                                                                                       | Keep       |
| Employment   | Employment Type        | multi‑select | Contractor - hourly, Contractor - fixed rate, Contractor - project based, FTE - hourly, FTE - salary, PTE - hourly, PTE - salary | Keep       |
| Employment   | Date Added             | date range   | Filters by account creation date                                                                                                 | Keep       |
| Employment   | Date Removed           | date range   | Filters by removal date. Only relevant when "Show removed members" is on                                                         | Keep       |
| Employment   | Time Tracking Status   | multi‑select | Enabled, Disabled                                                                                                                | Keep       |
| Employment   | Currency               | multi‑select | Dynamic — currencies used in the org                                                                                             | Keep       |
| Other        | Show Removed Members   | checkbox     | Includes removed members in the list. Unlocks the Date Removed filter                                                            | 🔴 Remove  |
