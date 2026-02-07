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

### Preventative rules
- After changing `next.config.ts`, always restart the dev server (or clear `.next` cache).
- Every image component should use `normalizeImageSrc()` and have a fallback.
- When adding new remote image hosts, add them to `next.config.ts > images.remotePatterns`.
- Never trust third-party demo storage URLs long-term — they expire. Use local assets for seed/mock data.
