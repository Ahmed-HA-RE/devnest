## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions and simple mutations
- Use API routes when you need:
  - Webhooks (Stripe, GitHub, etc.)
  - File uploads with progress tracking
  - Long-running operations
  - Specific HTTP status codes or headers
  - Endpoints for future mobile/CLI clients
  - Third-party integrations
- Dynamic routes for item/collection pages

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `@/app/globals.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

Example v4 configuration:

```css
@import 'tailwindcss';

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

## File Organization

- Components: If a component is only used within a specific route, place it in a route-scoped `_components` folder inside that route. If it is reused across multiple routes, place it in the global `@/components` directory.
- Pages: `@/app/[route]/page.tsx`
- Server Actions: `@/lib/actions/[feature].ts`
- Types: `@/types/[feature].ts`
- Lib/Utils: `@/lib/[utility].ts`

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Always use the arrow function syntax for components, typing the props parameter directly — never `React.FC<Props>` (e.g. `const ItemCard = ({ title }: ItemCardProps) => { ... }`)
- Files: kebab-case (`item-card.tsx`)
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable
- No inline styles
- Dark mode first, light mode as option

## Database

- Use Prisma ORM for all database operations
- Always use `prisma migrate dev` for schema changes (not `db push`)
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production deployments must run `prisma migrate deploy` before the app starts

## Data Fetching

- Server components fetch directly with Prisma
- Client components use Server Actions
- Validate all inputs with Zod
- Fetch data directly in server components but for large query avoid placing large or complex data-fetching logic directly inside the server component file. Instead, move database queries into dedicated server action files (e.g. @/lib/actions) and import them into the page.

## Error Handling

- Use try/catch in Server Actions
- Return `{ success, data, message }` pattern from actions
- Display user-friendly error messages via toast

## Testing

- Vitest is the unit testing framework, run via pnpm (`pnpm test`, `pnpm test:watch`, `pnpm test:coverage`)
- `jsdom` + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`) are available for component tests
- Config lives in `vitest.config.ts` (root) and `vitest.setup.ts`; the `@/*` alias mirrors `tsconfig.json`
- Colocate test files next to the source they cover, named `[file].test.ts`/`.test.tsx`
- What to test:
  - Server Actions that do create/update/delete (CRUD) operations
  - SSR components/server components that fetch data from the database
  - `lib/utils` (and similar `lib/*` helper) functions
  - Any function that formats dates with `date-fns` — test that the format produces the expected output

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
