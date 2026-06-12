# Current Feature

<!-- Feature name -->

Dashboard UI Phase 1 (1 of 3)

<!-- Feature Description -->

Set up the base dashboard layout and ShadCN UI.

<!-- Goals -->

- Initialize ShadCN UI and install components
- Apply custom theme via `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/cmluajfgz000004l5afke7znm` to update `global.css`
- Remove `lucide-react` (installed by ShadCN) and use `react-icons` instead
- Add `/dashboard` route with main layout and global styles
- Dark mode by default
- Top bar with:
  - Logo/brand name ("DevNest") on the left
  - Search (display only)
  - "New item and collection" buttons (display only)
  - Theme toggle button (ShadCN `Button`, icon size) aligned to the end
- Placeholder layout: sidebar area with `<h2>Sidebar</h2>` and main area with `<h2>Main</h2>`
- Match the look/feel of @context/screenshots/dashboard-ui-main.png (not pixel-perfect)

<!-- Status -->

Complete

<!-- History -->

- 2026-06-12: Implemented ShadCN UI init (Radix/Nova), tweakcn theme, react-icons swap, and `/dashboard` route with topbar, sidebar/main placeholders. Build passing.
