# DevNest

DevNest is a centralized developer workspace for storing commands, documentation, code snippets, notes, images, links, and technical resources in one searchable, organized hub.

## Context Overview

Refer to these files for more context on DevNest:

- @/context/project-overview.md
- @/context/coding-standards.md
- @/context/ai-interaction.md
- @/context/current-feature.md

## MCP

### Neon

- Project: `devnest` (id `red-credit-06529381`).
- ALWAYS use the `development` branch (id `br-crimson-bread-a2x7nf86`) for every Neon query or modification, by default and without being asked, unless the user explicitly names another branch (e.g. "production") in that specific request.
- NEVER run any SQL or Neon tool call against the `production` branch (id `br-red-morning-a23myedb`) unless the user explicitly types "production" in their current message. A prior approval does not carry over to later requests.
- Treat this as a standing default for all Neon MCP tool calls (`run_sql`, `get_database_tables`, `describe_branch`, etc.) in this repo — do not ask which branch to use; assume `development`.

### shadcn && shadcn-studio-mcp

- For any shadcn or shadcn-studio-mcp mcp always use pnpm dlx to run the tool, never npm or yarn.
