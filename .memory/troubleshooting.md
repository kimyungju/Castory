## Troubleshooting Log

### Issue 1: Missing public/ directory
- Summary: All `<Image />` components showed broken placeholders.
- Root cause: `public/` directory did not exist. Asset zip had not been downloaded.
- Fix: Created `public/icons/` with placeholder SVGs, then replaced with real assets from tutorial zip.

### Issue 2: Remote images blocked by next/image
- Summary: Podcast thumbnails from Convex (lovely-flamingo-139.convex.cloud) threw runtime error.
- Error: `Invalid src prop — hostname not configured under images in next.config.js`
- Root cause: `next.config.ts` was missing `images.remotePatterns`. Also, the dev server was not restarted after adding the config.
- Fix: Added `remotePatterns` with `protocol: "https"` and `hostname: "lovely-flamingo-139.convex.cloud"`. Cleared `.next` cache.

### Issue 3: Comprehensive image safety
- Summary: No fallback for empty/invalid image src; no path normalization.
- Fix applied:
  - Created `normalizeImageSrc()` helper in `lib/utils.ts` — handles http URLs, absolute paths, `public/` prefix stripping, and empty/null fallback.
  - Created `/public/placeholder.svg` as a universal fallback image.
  - `PodcastCard` uses `onError` to swap broken remote images to placeholder.
  - `LeftSidebar` runs all sidebar icon paths through `normalizeImageSrc()`.
- Rule: All image paths from `public/` must use absolute paths (`/icons/...`), never `public/...` or relative paths.

### Issue 4: Podcast thumbnails showing "No Image" placeholder
- Summary: Cards rendered but showed `/placeholder.svg` instead of real thumbnails.
- Root cause: `imgURL` was NOT null — it contained valid-looking Convex URLs (`https://lovely-flamingo-139.convex.cloud/api/storage/...`), but those are from the tutorial creator's Convex deployment and have **expired/been deleted**. The `onError` handler correctly caught the 404 and swapped to placeholder.
- Fix: Replaced dead Convex URLs in `constants/index.ts` with local SVG thumbnails at `/images/podcast-{1-4}.svg`. These are guaranteed to resolve since they live in `public/`.
- Note: Once we set up our own Convex deployment with real podcast data, these seed thumbnails will be replaced by actual storage URLs.

### Issue 5: Clerk /sign-in card left-aligned and misaligned divider
- Summary: The Clerk SignIn card was stuck to the left side of the page. Social buttons and "or" divider were mis-centered.
- Root cause (3 factors):
  1. `* { margin: 0; padding: 0; }` global CSS reset was stripping all internal margins/padding from Clerk's own DOM elements, breaking their card layout.
  2. `@layer base { * { @apply border-border } }` applied borders to every element including Clerk internals.
  3. `colorPrimary: ""` (empty string) in Clerk appearance config broke the primary button color.
- Fix:
  - Replaced the aggressive `* { margin: 0; padding: 0; }` with `* { box-sizing: border-box; }` only.
  - Set `colorPrimary: "#f97535"` (orange theme) instead of empty string.
  - Auth layout uses `flex min-h-screen items-center justify-center bg-black-3 px-4` for proper centering.
  - Sign-in/sign-up pages render bare `<SignIn />` / `<SignUp />` with no extra wrappers.
- Rule: Never use a global `* { margin: 0; padding: 0; }` reset — it breaks third-party component libraries like Clerk. Use `box-sizing: border-box` only.

### Issue 6: Clerk webhooks failing (all attempts return error)
- Summary: All Clerk webhook events (user.created, user.updated) fail on Convex.
- Root causes (3 bugs):
  1. **CLERK_WEBHOOK_SECRET not in Convex env** — The secret was only in `.env.local` (Next.js), but Convex HTTP actions run on Convex's servers with their own separate environment. The handler threw "CLERK_WEBHOOK_SECRET is not defined" immediately, causing a 500 for every call. Fix: Must set the secret via `npx convex env set CLERK_WEBHOOK_SECRET "whsec_..."` or through the Convex Dashboard.
  2. **No try-catch around `wh.verify()`** — If signature verification failed, `svix` threw an error that was not caught. Instead of returning `undefined` (which the caller handles gracefully as a 400), the unhandled throw caused a 500. Fix: Wrapped `wh.verify()` in try-catch, returning `undefined` on failure.
  3. **`event.data.first_name` can be null** — OAuth sign-ups (Google/GitHub) may not have `first_name`. The `!` TypeScript assertion does nothing at runtime; `null` was passed to `createUser` which expects `v.string()`, causing the mutation to reject. Fix: Added `?? email_prefix ?? "Unknown"` fallback chain.
- Additional improvement: Added `console.log` statements for each event type so errors are visible in the Convex Dashboard logs.

### Preventative rules
- After changing `next.config.ts`, always restart the dev server (or clear `.next` cache).
- Every image component should use `normalizeImageSrc()` and have a fallback.
- When adding new remote image hosts, add them to `next.config.ts > images.remotePatterns`.
- Never trust third-party demo storage URLs long-term — they expire. Use local assets for seed/mock data.
- `.env.local` is ONLY for Next.js. Convex server-side env vars must be set via `npx convex env set` or the Convex Dashboard.
- Always wrap `svix` `wh.verify()` in try-catch — verification failures throw, they don't return null.
- Never trust Clerk event fields like `first_name` to be non-null — always provide fallbacks for OAuth-based sign-ups.
- Clerk `email_addresses` can be empty on user.created; use optional chaining and a fallback email (e.g. `id@clerk.user`).
- For webhook-called internal mutations, consider no-op when the entity doesn't exist so the webhook returns 200 and avoids endless retries.

### Issue 7: user.created crash — "Cannot read properties of undefined (reading 'email_address')"
- Summary: After setting CLERK_WEBHOOK_SECRET and deploying with `npx convex dev`, user.created still failed at http.ts line 26.
- Root cause: Clerk can send `user.created` with an **empty `email_addresses`** array (e.g. OAuth before email is linked). Code used `event.data.email_addresses[0].email_address` without checking, so `[0]` was undefined.
- Fix in convex/http.ts: Use optional chaining and fallbacks — `primaryEmail = event.data.email_addresses?.[0]?.email_address`, `email = primaryEmail ?? \`${event.data.id}@clerk.user\``, `imageUrl: event.data.image_url ?? ""`. Same for user.updated.
- Follow-up: updateUser/deleteUser threw "User not found" when the user had never been created (e.g. earlier user.created failed). Fix in convex/user.ts: In the internal mutations updateUser and deleteUser, if user is not found, return without throwing so the webhook returns 200 and Clerk retries stop (idempotent behavior).
