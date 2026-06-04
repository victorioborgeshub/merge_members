# Account Type Merge Rules

The rule is simple. From Dmitry Gubitskiy (April 2026):

> **FROM side: silent users only. TO side: any user.**

## Acceptable merges

| FROM (duplicate) | TO (surviving) | Allowed? |
|---|---|---|
| Silent | Standard | ✅ |
| Silent | SCIM | ✅ |
| Silent | SSO | ✅ |
| Silent | Silent | ✅ |
| Standard | Silent | ❌ |
| Standard | SCIM | ❌ |
| SCIM | anything | ❌ |
| SSO | anything | ❌ |

SCIM and SSO behave like Standard on the FROM side — they can only be merge targets, never sources.

## Notes

- Standard → Silent is guarded on both frontend and backend
- Merge is permanent and non-reversible
- Auto-merge triggers when a Silent app device has a UPN matching an existing SCIM or Silent account; if no UPN is present, manual merge is required
