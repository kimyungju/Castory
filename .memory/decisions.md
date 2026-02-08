## Decisions

### Next.js 16
- Chosen for modern app routing, server components, and strong ecosystem support.
- Enables rapid full-stack iteration with a single codebase.
- Uses `proxy.ts` instead of `middleware.ts` (Next.js 16 deprecated the middleware file convention in favor of proxy).

### Convex (replaced Supabase)
- Real-time reactive database with automatic TypeScript codegen.
- Built-in file storage (`_storage`) for audio and images.
- Search indexes for full-text search on podcasts.
- Seamless Clerk integration via `convex/react-clerk`.

### Clerk
- Handles user authentication (sign-up, sign-in, session management).
- Integrated with Convex via JWT verification for server-side auth.

### OpenAI
- Reliable LLMs and embeddings for script generation and RAG.
- Strong tooling and documentation for quick integration.

### Daily Automation
- Prioritize scheduled daily workflows using Vercel Cron to automate ingestion and publishing.
