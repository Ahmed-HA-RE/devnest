# Current Feature

<!-- Feature name -->

Neon + Prisma Setup

<!-- Feature Description -->

Set up Prisma ORM with a Neon PostgreSQL (serverless) database for DevNest, including an initial schema derived from the data models in `context/project-overview.md` and the Better Auth core schema (Account, Session, Verification).

<!-- Goals -->

- Configure Prisma 7 (review breaking changes/upgrade guide before implementing)
- Connect to Neon PostgreSQL via `DATABASE_URL`
- Create initial schema based on data models in `context/project-overview.md` (expected to evolve)
- Include Better Auth models: User, Account, Session, Verification
- Add appropriate indexes and cascade deletes
- Use a development branch for `DATABASE_URL`; always generate migrations, never push directly to the database unless explicitly specified

<!-- Status -->

Completed

<!-- History -->

- 2026-06-12: Implemented ShadCN UI init (Radix/Nova), tweakcn theme, react-icons swap, and `/dashboard` route with topbar, sidebar/main placeholders. Build passing.
- 2026-06-13: Implemented Dashboard UI Phase 2 — collapsible sidebar (shadcn Sidebar/Sheet/Tooltip/Avatar/DropdownMenu), sidebar sections for item Types (with per-type colors), Favorite & Recent collections, and a user account dropdown in the sidebar footer. Added sidebar toggle to `TopBar` and moved the DevNest logo into the sidebar header with a border-right separating it from the main content. Updated mock data with `createdAt`/`updatedAt` on collections (for recents sorting) and `color` on item types. Migrated theming to `@teispace/next-themes` and added SEO metadata to root layout and dashboard page.
- 2026-06-14: Implemented Dashboard UI Phase 3 — added stats cards (items, collections, favorite items, favorite collections), a recent collections grid, a pinned items section, and a recent items list to the dashboard main area, all driven by mock data. Added shared color helpers (`lib/colors.ts`) for named/hex collection and item-type colors, added shadcn Card/Badge components, and used `date-fns` for date formatting. Updated the sidebar to list all collections, and made the topbar responsive by moving the New Collection/New Item actions into the mobile sidebar menu on smaller screens.
- 2026-06-14: Set up Prisma 7 + Neon PostgreSQL. Added `prisma/schema.prisma` with the DevNest data model (User, Item, ItemType, Collection, Tag, ItemTag) plus Better Auth core models (Account, Session, Verification), each with indexes and cascade deletes. Added `prisma.config.ts` (Prisma 7 config + seed command), a `PrismaNeon` adapter-based client singleton at `lib/db.ts`, `.env`/`.env.example` for `DATABASE_URL`, and a seed script (`prisma/seed.ts`) that loads `lib/mock-data.ts` into the dev database. Ran the initial migration and seed successfully; build passes.
