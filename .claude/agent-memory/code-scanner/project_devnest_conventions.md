---
name: project-devnest-conventions
description: DevNest-specific facts that prevent false positives in security/quality audits of this repo
metadata:
  type: project
---

- `.gitignore` at repo root already excludes `.env*` (with `!.env.example` carve-out). Verified directly — never flag `.env` exposure in this repo again unless `.gitignore` content changes.
- Auth is implemented via `better-auth` (`lib/auth.ts`), with `emailAndPassword`, GitHub/Google `socialProviders`, and an `emailOTP` plugin used for email verification, sign-in-by-OTP-style flows, and forgot/reset-password. Do not flag "missing auth" — it exists and is fairly mature (sessions, OAuth, OTP, email verification all wired up as of 2026-06-24).
- `context/current-feature.md` keeps a dated `History` log of every shipped feature with real implementation detail (schemas added, files created, config values set at the time). This is a reliable source to diff "what changed intentionally for THIS feature" vs "stray/leftover change" — e.g. it recorded `allowedAttempts: 6` was the deliberate value set in the 2026-06-23 Email Verification entry, which let the 2026-06-24 reset-password audit confirm the drop to `allowedAttempts: 1` was very likely accidental/leftover debugging rather than intentional.
- File convention: each `(auth)` route lives at `app/(auth)/<route>/page.tsx` (server component, handles metadata + redirect/session checks) with a co-located `_components/<route>-form.tsx` client component (react-hook-form + zod + `authClient`). Forms follow a consistent shape: `Controller`-per-field, shadcn `Field`/`FieldError`/`FieldGroup`, `Spinner`/text ternary on submit button with `min-w-32`, `sonner` toast on error via thrown `Error` in a try/catch. One component per file is the norm — multi-component files (like `reset-password-form.tsx` defining both `NewPasswordForm` and `ResetPasswordForm`) are a deviation worth flagging as a Low/structural finding, not necessarily wrong but inconsistent with the rest of `(auth)/*`.
- `schema/auth.ts` builds up shared zod primitives (`authSchema.shape.email`/`password`) that later schemas reuse via `.shape.X` rather than redefining — when auditing new schemas, check whether they reuse existing shared pieces (e.g. `otpSchema`, `authSchema.shape.password`) before flagging duplication.
