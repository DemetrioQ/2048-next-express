# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a pnpm monorepo for a 2048 game application with:
- **Frontend**: Next.js 15 (React 19, TypeScript, Tailwind CSS, Radix UI) — runs on port 3000
- **Backend**: Express.js 5 (TypeScript, MongoDB/Mongoose, Passport.js) — runs on port 8000
- **Shared package**: `shared-2048-logic` — game logic shared between apps

## Common Commands

Use `pnpm --filter <package-name> <script>` to target a specific app.

```bash
# Install all dependencies
pnpm install

# Development (run in separate terminals)
pnpm --filter 2048-express dev     # backend (nodemon + ts-node)
pnpm --filter 2048-next dev        # frontend (next dev)

# Build
pnpm --filter 2048-express build   # tsc compile to dist/
pnpm --filter 2048-next build      # next build

# Docker dev (hot reload via `docker compose watch`)
docker compose up
docker compose watch   # enable file-sync hot reload

# Docker production
docker compose -f docker-compose.prod.yml up -d --build
```

There are no tests currently implemented.

## Architecture

### Request Flow
Frontend (`localhost:3000`) → REST API → Express backend (`localhost:8000`) → MongoDB Atlas

Authentication uses cookie-based sessions (`express-session` + MongoDB store) combined with JWT access/refresh tokens. OAuth is implemented for Google and GitHub via Passport.js strategies in `apps/2048-express/src/passport/`.

### Shared Game Logic
`packages/shared-2048-logic` is consumed as TypeScript source by both apps in dev — its `package.json` `main`/`exports` point at `src/*.ts`, Next transpiles it via `transpilePackages` in `next.config.ts`, and the backend resolves it through `tsconfig` `paths` while `nodemon.json` watches the package directory and restarts on edits. No manual `pnpm --filter shared-2048-logic build` is needed for development; the `build` script is only used for production output. Game state validation runs on the backend using this same shared logic to verify submitted scores.

### Key Entry Points
- Backend: `apps/2048-express/src/app.ts` — Express app setup, middleware, route mounting
- Frontend: `apps/2048-next/app/page.tsx` — main game page using `GameClient` component
- Shared: `packages/shared-2048-logic/src/` — `types/`, `utils/` (moveLogic, gameLogic, gridHelper, seededRandom)

### Backend Structure
```
apps/2048-express/src/
  controllers/   — route handlers (auth, scores, profile)
  routes/        — Express routers (/auth, /scores, /profile)
  models/        — Mongoose schemas (User, Score, RefreshToken, RequestLog)
  middlewares/   — auth middleware, error handler, request logging
  passport/      — Google and GitHub OAuth strategies
  config/        — configuration helpers
```

### Frontend Structure
```
apps/2048-next/app/
  components/    — React components
  context/       — React Context (auth state, game state)
  hooks/         — custom hooks
  login/         — login UI
  oauth/         — OAuth callback pages
  profile/       — user profile page
  verify-email/  — email verification flow
  api/uploadthing/ — Next.js API route for file uploads
```

## Environment Variables

**Backend** (`apps/2048-express/.env`):
- `MONGO_URI`, `PORT=8000`, `FRONTEND_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
- `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`
- `UPLOADTHING_TOKEN`, `RESEND_API_KEY`

**Frontend** (`apps/2048-next/.env`):
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
- `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000`
- `UPLOADTHING_TOKEN`, `EMAIL_VALIDATION_COOLDOWN_IN_MINUTES`

## Known Issues (from README)

- ~~Score submission bug: refreshing after submit resets undo count~~ — **Fixed**: `disableUndos()` is called on successful submission, persisted to localStorage
- ~~Email verification redirect shows login modal to logged-in users~~ — **Fixed**: `[showLogin, loading]` dep array ensures the check runs after auth resolves
- ~~"Game is not valid" on fresh games~~ — **Fixed**: `resetGame()` now clears stale `moveHistory` from localStorage
