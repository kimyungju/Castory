# Podcastr

An AI-powered podcast platform that lets you create, discover, and listen to podcasts. Generate news podcasts from trending articles or create custom podcasts with AI-generated audio and cover art.

## Features

- **AI News Podcast Creator** -- 5-step guided workflow: pick a topic, curate trending articles (via GPT web search), generate a podcast script, convert to speech, and publish
- **Custom Podcast Creation** -- Write your own script, choose an AI voice, and generate audio + thumbnail
- **Text-to-Speech** -- Six OpenAI voice options (alloy, shimmer, nova, echo, fable, onyx) with automatic chunking for long scripts
- **AI Thumbnail Generation** -- DALL-E 3 cover art from text prompts, or upload your own image
- **Discover & Search** -- Full-text search across podcast titles with debounced input
- **Persistent Audio Player** -- Sticky bottom player with play/pause, skip, rewind, mute, and progress bar
- **User Profiles** -- View any creator's profile, podcast count, and total listeners
- **Draft Persistence** -- News podcast drafts auto-save to localStorage and restore on revisit
- **Authentication** -- Clerk-powered sign-in/sign-up with webhook sync to Convex

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Backend | Convex (serverless functions, real-time database, file storage) |
| Auth | Clerk (session management, webhooks) |
| AI | OpenAI -- GPT-4.1-mini (news search + script generation), TTS-1 (audio), DALL-E 3 (thumbnails) |
| Styling | Tailwind CSS 4 + shadcn/ui + Lucide React icons |
| Forms | React Hook Form + Zod |
| Notifications | Sonner (toast) |
| Carousel | Embla Carousel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account (free tier works)
- A [Clerk](https://clerk.com) account (free tier works)
- An [OpenAI](https://platform.openai.com) API key

### Install

```bash
git clone <your-repo-url>
cd podcastr
npm install
```

### Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_CONVEX_URL=<your convex deployment url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your clerk publishable key>
```

Set Convex server-side environment variables:

```bash
npx convex env set OPENAI_API_KEY <your openai api key>
npx convex env set CLERK_WEBHOOK_SECRET <your clerk webhook secret>
```

> **Clerk Webhook Setup:** In the Clerk dashboard, create a webhook pointing to your Convex HTTP endpoint (`https://<your-deployment>.convex.cloud/clerk`) and subscribe to `user.created`, `user.updated`, and `user.deleted` events. Copy the signing secret into `CLERK_WEBHOOK_SECRET`.

### Run

```bash
npm run dev
```

This starts both the Next.js dev server (port 3000) and the Convex dev server concurrently.

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js + Convex dev servers |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  (auth)/              # Public auth pages (sign-in, sign-up)
  (root)/              # Protected app pages
    create-podcast/    # Manual podcast creation
    create-news-podcast/ # AI news podcast wizard
    discover/          # Browse & search podcasts
    podcast/[podcastId]/ # Podcast detail + player
    profile/[profileId]/ # User profile
  providers/           # AudioProvider (playback context)

components/
  GeneratePodcast.tsx  # TTS audio generation
  GenerateThumbnail.tsx # DALL-E / upload thumbnail
  TopicSelector.tsx    # News topic picker
  ArticleReview.tsx    # Article curation UI
  ScriptEditor.tsx     # Script editing + tone/duration controls
  PodcastPlayer.tsx    # Sticky audio player
  PodcastCard.tsx      # Podcast grid card
  PodcastDetailPlayer.tsx # Detail page player + delete
  LeftSidebar.tsx      # Navigation sidebar
  RightSidebar.tsx     # Right sidebar
  MobileNav.tsx        # Mobile navigation
  Carousel.tsx         # Embla carousel wrapper

convex/
  schema.ts            # Database schema (podcasts, users)
  podcast.ts           # Podcast CRUD queries/mutations
  news.ts              # News fetch + script generation (GPT actions)
  openai.ts            # TTS + DALL-E actions
  user.ts              # User queries/mutations
  http.ts              # HTTP router (Clerk webhooks)
  auth.config.ts       # Clerk domain config for Convex
```

## Deployment

### Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set environment variables in Vercel project settings:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Deploy. Vercel auto-detects Next.js and runs `npm run build`.

### Convex

```bash
npx convex deploy
```

This pushes your Convex functions to production. Make sure production environment variables are set:

```bash
npx convex env set OPENAI_API_KEY <key> --prod
npx convex env set CLERK_WEBHOOK_SECRET <secret> --prod
```

Update `NEXT_PUBLIC_CONVEX_URL` in Vercel to point to your production Convex deployment.

## Environment Variables Reference

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` / Vercel | Convex deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` / Vercel | Clerk publishable key |
| `OPENAI_API_KEY` | Convex env | OpenAI API key (GPT, TTS, DALL-E) |
| `CLERK_WEBHOOK_SECRET` | Convex env | Clerk webhook signing secret |

## Troubleshooting

- **"OPENAI_API_KEY is not set"** -- Set it via `npx convex env set OPENAI_API_KEY <key>`, not in `.env.local`. Convex server-side actions read from the Convex environment.
- **Images not loading** -- Add the image hostname to `remotePatterns` in `next.config.ts`.
- **Clerk webhook 400/500** -- Verify `CLERK_WEBHOOK_SECRET` matches the signing secret from Clerk dashboard. Check that your webhook URL is `https://<deployment>.convex.cloud/clerk`.
- **Styles broken after config change** -- Delete `.next/` and restart the dev server.
- **TTS fails on long scripts** -- Audio generation auto-chunks at 4096 characters. If issues persist, try a shorter script.

## Roadmap

- [ ] Embed-based podcast recommendations (semantic similarity)
- [ ] Scheduled daily news podcast generation
- [ ] Podcast RSS feed export
- [ ] Comments and likes
- [ ] Playlist support
