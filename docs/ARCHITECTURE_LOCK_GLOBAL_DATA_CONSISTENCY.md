# ARCHITECTURE LOCK: GLOBAL DATA CONSISTENCY & REALTIME SYNCHRONIZATION

**System**: Hệ Thống Kiểm Phiếu Bầu Cử Điện Tử (AppBauCu)  
**Status**: LOCKED & AUTHORITATIVE  
**Effective Date**: August 13, 2026  

---

## 1. DATA SOURCE OF TRUTH

```text
Supabase PostgreSQL Database
            ↓
  Single Source of Truth
```

- **Supabase PostgreSQL** is the absolute, authoritative Source of Truth for all server and business data across the system.
- `localStorage`, `sessionStorage`, `Zustand`, and React state MUST NOT be used as substitute data sources for server entities.
- Merging server data with legacy/stale records from `localStorage` is **strictly prohibited**.

---

## 2. SERVER DATA FLOW

```text
Supabase PostgreSQL
        ↓
   Initial Fetch
        ↓
React State / Existing Store
```

- When the application mounts, initial data snapshots are fetched directly from Supabase DB.
- Client state represents the active view of the authoritative DB snapshot.

---

## 3. CROSS-BROWSER REALTIME SYNCHRONIZATION

```text
Browser A Mutation
        ↓
Supabase Database Updated
        ↓
Supabase Realtime Broadcast (postgres_changes)
        ↓
Browser B / C Listener
        ↓
Auto Refetch / State Sync (No F5 / Reload)
```

### Strictly Forbidden Mechanisms:
- ❌ `window.location.reload()` or forced browser reloads.
- ❌ `setTimeout()` or artificial delay timers to mask asynchronous state updates.
- ❌ Merging stale `localStorage` records with DB responses.
- ❌ Unnecessary background polling loops.
- ❌ Custom/over-engineered synchronization frameworks or event buses.

---

## 4. LOCALSTORAGE USAGE BOUNDARIES

`localStorage` is strictly restricted to non-server UI parameters:
- UI preferences & theme
- Filter, search, and sorting criteria
- Draft forms / temporary UI interaction state

`localStorage` MUST NOT serve as a backup or primary store for server business entities.

---

## 5. LOCKED REALTIME TABLES SCOPE

The following 8 shared business tables are locked for Realtime broadcast:
1. `user_accounts`
2. `voters`
3. `candidates`
4. `ballot_records`
5. `committee_members`
6. `witnesses`
7. `election_units`
8. `election_level_configs`

> New tables MUST NOT be enabled for Realtime automatically. A new table may only enable Realtime if it represents shared business data that can be mutated across different user sessions and requires instant cross-browser synchronization.

---

## 6. FUTURE DEVELOPMENT GUIDELINES

When building new features or modules:
1. **Supabase DB is the Single Source of Truth.**
2. **Never persist server data into `localStorage`.**
3. **If data is shared business data needing cross-browser sync → use Supabase Realtime.**
4. **Leverage the existing architecture (`electionDataService.ts` & `userService.ts`).**
5. **Do not introduce additional synchronization frameworks.**

### Core Philosophy:
> **SIMPLE — STABLE — MAINTAINABLE — PREDICTABLE**
