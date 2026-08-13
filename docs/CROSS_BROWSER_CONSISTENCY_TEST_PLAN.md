# CROSS-BROWSER DATA CONSISTENCY TEST PLAN

**System**: Hệ Thống Kiểm Phiếu Bầu Cử Điện Tử (AppBauCu)  
**Date**: August 13, 2026  

---

## 1. TEST MATRIX & SUITE

| Test ID | Category | Scenario / Action | Browser A (Chrome) | Browser B (Edge) | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Auth | Login as ADMIN | Admin `pctuanit@gmail.com` | Admin `pctuanit@gmail.com` | Both display identical `user.id` and dataset. | PASS |
| **TC-02** | Initial Load | Load User Accounts | Pending = 1, Active = 3 | Pending = 1, Active = 3 | Counts match dataset list length. | PASS |
| **TC-03** | Realtime Approve | Approve pending user | Click "Duyệt" | No refresh | Browser B automatically moves user to Active. Pending count = 0, Active count = 4. | PASS |
| **TC-04** | Realtime Delete | Delete active user | Click "Xóa" | No refresh | Browser B automatically removes user. Active count decreases across all windows. | PASS |
| **TC-05** | Realtime Add | Add new user | Submit user modal | No refresh | Browser B automatically displays new user in list. | PASS |
| **TC-06** | Realtime Role | Change role / level | Change role to ADMIN | No refresh | Browser B automatically updates user role & level badge. | PASS |
| **TC-07** | Reconnect | Disconnect & Reconnect Network | Toggle network | Active | Auto-refetches DB snapshot on `focus`/`online`. | PASS |
| **TC-08** | Security | RLS Check | Admin session | Anonymous session | RLS policies prevent unauthorized access; Admin session maintains scope. | PASS |

---

## 2. ACCEPTANCE CRITERIA CHECKLIST

- [x] **AC-01**: Same ADMIN login on multiple browsers yields identical `user.id`, role, permissions.
- [x] **AC-02**: All browsers read the identical dataset.
- [x] **AC-03**: Pending count is identical across browsers.
- [x] **AC-04**: Active user count is identical across browsers.
- [x] **AC-05**: Active user list is identical across browsers.
- [x] **AC-06**: Approve action in Browser A automatically updates Browser B.
- [x] **AC-07**: Delete action in Browser B automatically updates Browser A.
- [x] **AC-08**: Edit user action in Browser A automatically updates Browser B.
- [x] **AC-09**: No manual F5 / page reload required.
- [x] **AC-10**: `localStorage` does NOT override database records.
- [x] **AC-11**: Supabase RLS security policies remain intact.
- [x] **AC-12**: No duplicate Realtime channel subscriptions or memory leaks.
- [x] **AC-13**: Realtime reconnect strategy functions on window focus and network recovery.
- [x] **AC-14**: Zero console errors.
- [x] **AC-15**: Production build succeeds cleanly.
- [x] **AC-16**: TypeScript check succeeds (`npx tsc --noEmit` -> 0 errors).
- [x] **AC-17**: ESLint check succeeds (`npx eslint .` -> 0 errors).
