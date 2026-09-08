# Supabase backend state — REVIVAL R6

This file records the already-applied production backend state for REVIVAL R6.

## Applied migration

- Project: `xltwwvutqkpmtmlavngi`
- Migration name: `revival_r6_unique_aliases`
- Version: `20260908155140`
- Status: **APPLIED**
- Index: `profiles_unique_alias_identity_idx`
- UNIQUE: **true**
- Table: `public.profiles`
- Source SQL: `REVIVAL-R6_unique_aliases.sql`

## Verification

- Canonical duplicate groups before migration: **0**
- Canonical duplicate groups after migration: **0**
- User-data rows were not changed by the migration.

Verified table counts before → after:

- `profiles`: **16 → 16**
- `reviews`: **11 → 11**
- `review_likes`: **16 → 16**
- `review_replies`: **6 → 6**
- `admins`: **0 → 0**

Two legacy profiles with NULL `alias_code` existed before the migration. They are intentionally outside the index predicate and were not modified by R6.

`official_team` is also intentionally excluded from the index predicate. Empty aliases are excluded as well. For `curated_*` aliases, the canonical identity includes both `alias_code` and `alias_number`.

**This file records an already-applied production migration. Do not re-run it merely because this document exists.**
