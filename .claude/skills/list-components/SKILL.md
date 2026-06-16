# List Components

Name: List Components

Description: List all the components or the components inside a directory

## Task:

- Scan all extenstions: `jsx`, `tsx`, `mdx`

- If no specific directory given scan all components inside `@/components` and `app/*/_components`

- if specific directory is provided example: dashboard then scan it like: `/dashboard/_components`

- if (shared) word is provided then scan all the shared components. I usually add them inside `@/components/shared`

- if (shadcn) word is provided then scan all the `@/components/ui` components and short description what each component is.

## Output Response:

Numbered list, one component per line with a short one-line description of what it does.
