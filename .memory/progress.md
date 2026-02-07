## Progress Log

- 2026-02-07: Project Initialization & Memory Setup.
- 2026-02-07: Created route structure (home, discover, create-podcast, profile, podcast/[podcastId]).
- 2026-02-07: Built LeftSidebar with nav links, active-route highlighting via `cn()`, and `usePathname`.
- 2026-02-07: Fixed broken images — created `public/icons/` with placeholder SVGs (logo, home, discover, microphone, profile).
- 2026-02-07: Added project color utilities to globals.css (bg-black-*, text-white-*, border-orange-1, bg-nav-focus).
- 2026-02-07: Updated root layout metadata (title: Podcaster, favicon: logo.svg).
- 2026-02-07: Built full root group layout with LeftSidebar, RightSidebar, MobileNav placeholder, and main content section.
- 2026-02-07: Created PodcastCard component with image, title, and description.
- 2026-02-07: Added demo podcastData to constants/index.ts with Convex-hosted thumbnails.
- 2026-02-07: Updated home page to render podcast grid, styled discover and create-podcast pages.
- 2026-02-07: Configured next.config.ts with remote image pattern for lovely-flamingo-139.convex.cloud.
- 2026-02-07: Added text size utilities (text-12 through text-32), podcast_grid layout, and text-white-4 to globals.css.
- 2026-02-07: Comprehensive image fix — added normalizeImageSrc() helper, placeholder.svg fallback, onError handling in PodcastCard, cleared .next cache.
- 2026-02-07: Replaced dead Convex demo thumbnail URLs with local SVGs in podcastData.
- 2026-02-07: Set up Convex backend — schema.ts with podcasts, users, and tasks tables. Added search indexes on podcasts.
- 2026-02-07: Wired ConvexClientProvider into root layout for reactive queries.
- 2026-02-07: Integrated Clerk auth — created ConvexClerkProvider wrapping ClerkProvider + ConvexProviderWithClerk.
- 2026-02-07: Added convex/auth.config.ts for Clerk JWT verification.

