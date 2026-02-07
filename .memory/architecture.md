## Architecture

### Data Flow
1. RSS Scraper ingests daily tech/security news feeds.
2. LLM Scripting generates a structured podcast script.
3. TTS converts the script to audio.
4. Convex Storage stores audio and metadata.

### Auth Flow
1. Clerk handles sign-up/sign-in on the client (ClerkProvider).
2. ConvexProviderWithClerk passes Clerk JWT to Convex.
3. Convex auth.config.ts validates the JWT via Clerk issuer URL.
4. Convex functions can access authenticated user identity.

### RAG Pipeline
1. Article Embedding: create vector embeddings for each article.
2. Vector Search: retrieve relevant articles for a user query.
3. Grounded Answer: generate a response using retrieved sources.

### Data Model
- User (Auth)
- Article (Content, Embeddings, Source URL)
- Briefing (Script, AudioURL, Article Refs)
- Chat (User-Briefing Context)
