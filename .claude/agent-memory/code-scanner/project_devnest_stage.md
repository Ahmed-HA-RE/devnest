---
name: project-devnest-stage
description: DevNest is a pre-CRUD MVP Next.js app — auth, API routes, and server actions are intentionally not yet built
metadata:
  type: project
---

As of 2026-06-19 (audit date), DevNest is in early dashboard-UI-with-real-data phase:

- No NextAuth/Better Auth packages installed yet (not in package.json), no `app/api/` directory, no `lib/actions/` directory exists. Confirmed by reading package.json and attempting to read those paths.
- `lib/constants/app.ts` has `CURRENT_USER_ID = 'user-1'` explicitly commented as "Placeholder until auth is implemented; matches the seeded dev user." Same pattern repeated in `app/dashboard/_components/sidebar-user-dropdown.tsx` (`currentUser` const, "Placeholder until auth is implemented").
- Roadmap in `context/project-overview.md` shows MVP checklist (Items CRUD, Collections, Search, Auth, Free tier limits) all unchecked `[ ]` — these are planned, not regressions.
- `context/current-feature.md` "History" log shows incremental dashboard build: ShadCN init -> sidebar -> stats/recent data wired to Prisma -> PRO badges -> Suspense skeletons (last entry 2026-06-17).
- **Do not flag**: missing auth, missing input validation/Zod (no forms/mutations exist yet to validate), missing rate limiting, missing CSRF protection, missing server actions — none of these have been built yet, so there's nothing to critique.
- `components/ui/*` and `hooks/use-mobile.ts` are stock shadcn-generated boilerplate (verbatim from shadcn's official templates) — don't nitpick style choices baked into the scaffold (e.g. the blanket `// eslint-disable-next-line` with no rule name in `use-mobile.ts` is inherited shadcn boilerplate, low severity at most).

See also [[feedback_no_shell_tool]].
