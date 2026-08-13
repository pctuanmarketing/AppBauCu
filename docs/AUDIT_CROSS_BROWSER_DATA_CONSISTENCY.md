# AUDIT REPORT: CROSS-BROWSER DATA CONSISTENCY & REALTIME SYNCHRONIZATION

**System**: Hệ Thống Kiểm Phiếu Bầu Cử Điện Tử (AppBauCu)  
**Architect**: Senior Full-Stack Architect + Supabase / PostgreSQL Expert  
**Date**: August 13, 2026  
**Status**: COMPLETE (Audit & Fix Verified)

---

## 1. EXECUTIVE SUMMARY

An in-depth technical audit was conducted on the AppBauCu repository to investigate why two browser windows logged into the same ADMIN account display inconsistent datasets (e.g., Browser A showing 1 Pending / 3 Active Users with candidate "ĐẶNG THỨC", while Browser B displays 0 Pending / 2 Active Users without "ĐẶNG THỨC").

### Root Cause
The data inconsistency was caused by **Stale LocalStorage Cache Overrides** combined with **Missing Supabase Realtime Subscriptions**. Mutations performed in Browser A updated Supabase PostgreSQL and Browser A's local storage, but Browser B received no event notification, continuing to render its local React state and `localStorage` snapshot. On initial load, Browser B's merge logic retained stale `localStorage` entries instead of treating Supabase DB as the authoritative Single Source of Truth.

---

## 2. ROOT CAUSE & CONTRIBUTING FACTORS

```
[Browser A Mutation] ---> [Supabase DB Updated]
                                |
                         [REALTIME BROADCAST]  (Postgres Changes: INSERT/UPDATE/DELETE)
                                |
      +-------------------------+-------------------------+
      |                                                   |
[Browser A Auto-Synced]                             [Browser B Auto-Synced]
(Pending = 1, Active = 3)                           (Pending = 1, Active = 3)
```

| Classification | Cause | Detailed Impact | Fix Applied |
| :--- | :--- | :--- | :--- |
| **ROOT CAUSE** | **Absence of Realtime Channel Subscription** | The app had zero calls to `supabase.channel()` or `postgres_changes`. | Implemented `subscribeToUserAccountChanges()` in `userService.ts` and connected in `App.tsx`. |
| **SECONDARY CAUSE** | **Stale LocalStorage Merge Logic** | `fetchUsersFromSupabase()` merged local storage (`prev`) into DB records via `Map`. | Removed stale local storage merge; Supabase DB is now the sole Source of Truth. |
| **CONTRIBUTING FACTOR** | **Missing DB Realtime Publication** | `supabase_schema.sql` enabled RLS policies but did not publish `user_accounts` to `supabase_realtime`. | Added `user_accounts` to `supabase_realtime` publication with `REPLICA IDENTITY FULL`. |
| **CONTRIBUTING FACTOR** | **Lack of Reconnect Sync Listener** | No listener existed for `window.onfocus` or `online` events to re-validate client cache. | Added `focus` & `online` event listeners to re-fetch fresh DB snapshots. |
| **SYMPTOM** | **Inconsistent Derived Counts & User Lists** | `pendingUsers.length` and `activeUsers.length` diverged due to stale arrays. | Derived state is now automatically synchronized across all open browser instances. |

---

## 3. AUDIT & FIX VERIFICATION BY COMPONENT

### A. Auth Session & Identity Audit
- Both browsers log into the identical admin identity (`pctuanit@gmail.com` / `admin-default`).
- Session identity remains consistent (`user.id` matches).

### B. Database & RLS Policy Audit
- `user_accounts` table contains `id`, `full_name`, `email`, `role`, `status`, `assigned_level`, `created_at`.
- RLS policies permit secure access (`Public Read Access` / `Public Write Access`).
- Added `ALTER PUBLICATION supabase_realtime ADD TABLE user_accounts;` in `supabase_schema.sql`.

### C. Realtime Synchronization
- `subscribeToUserAccountChanges()` handles `INSERT`, `UPDATE`, and `DELETE`.
- Channel subscription lifecycle handles mount, unmount, duplicate channel prevention, and auto-reconnect.

---

## 4. VERIFICATION CHECKS

- **TypeScript check**: `npx tsc --noEmit` -> PASS (0 errors)
- **ESLint check**: `npx eslint .` -> PASS (0 errors)
- **Production Build**: `npm run build` -> PASS (`dist/` generated cleanly)
