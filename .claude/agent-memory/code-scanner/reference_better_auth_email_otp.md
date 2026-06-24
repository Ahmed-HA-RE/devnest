---
name: reference-better-auth-email-otp
description: Exact source-verified semantics of better-auth's emailOTP plugin (allowedAttempts, checkVerificationOtp vs resetPassword/verifyEmail consumption) — read directly from node_modules, not docs
metadata:
  type: reference
---

Source of truth: `node_modules/better-auth/dist/plugins/email-otp/routes.mjs` and `otp-token.mjs` in this repo (better-auth is a fast-moving package; re-verify against the installed version if findings seem off — npm docs/issues are not reliable enough on this detail).

Key mechanics (as installed in DevNest):

- `allowedAttempts` (default 3) counts **incorrect** OTP guesses tolerated before the verification record is permanently invalidated (`TOO_MANY_ATTEMPTS`, 403) and deleted/consumed. It is NOT "attempts per call" — it's a running counter persisted on the verification row (`value` stored as `"<otp>:<attempts>"`), shared across repeated calls to the same identifier (email+type).
- Two different verification code paths exist, with different consumption behavior:
  - `checkVerificationOTP` (endpoint `/email-otp/check-verification-otp`, client `authClient.emailOtp.checkVerificationOtp`) — **read-only / non-consuming**. On success it just returns `{success:true}` and leaves the verification record in the DB untouched. On failure it increments the attempts counter. This is used for "pre-flight" OTP checks (e.g. DevNest's reset-password flow checks the OTP before showing the new-password form).
  - `atomicVerifyOTP` (internal helper, used by `verifyEmailOTP`, `signInEmailOTP`, `resetPasswordEmailOTP`, `changeEmailEmailOTP`) — **consumes** the record via `consumeVerificationValue` as the actual single-use gate. The attempt-budget check happens AFTER consuming, before comparing the OTP value. On a wrong guess it recreates the record with the same OTP/expiry and `attempts+1` so retries are still possible up to the budget; once `usedAttempts >= allowedAttempts` it throws `TOO_MANY_ATTEMPTS` and does not recreate the record (permanent lockout until resend).
- Practical implication: a UI flow that calls `checkVerificationOtp` first (non-consuming) and later calls a consuming endpoint (`resetPassword`, `verifyEmail`, etc.) with the same OTP is safe in terms of correctness, but the attempts counter is shared — a wrong guess at the `checkVerificationOtp` step still counts against the same budget that the later consuming call enforces. With a low `allowedAttempts` (e.g. 1), a single typo before the correct guess can cause the later consuming call to fail with `TOO_MANY_ATTEMPTS` even though the user "passed" the earlier check.
- `tryReuseOTP` (used when `resendStrategy: 'reuse'`) also respects `allowedAttempts` — a record at/over budget is treated as not-reusable and a fresh OTP is generated on resend.
- Rate limiting: the plugin auto-registers per-endpoint rate limits (3 requests / 60s window by default) for every email-otp endpoint, independent of `allowedAttempts`.

See [[project-devnest-conventions]] for how this was used to validate a stray `allowedAttempts: 6 -> 1` config change during the reset-password feature audit (2026-06-24).
