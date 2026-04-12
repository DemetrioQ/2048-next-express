# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps (layer-cached until manifests change)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-next/package.json apps/2048-next/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

RUN pnpm install --frozen-lockfile

# Copy sources
COPY packages/shared-2048-logic packages/shared-2048-logic
COPY apps/2048-next apps/2048-next

# NEXT_PUBLIC_ vars must be available at build time — pass via --build-arg
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL

RUN pnpm --filter 2048-next build

# ---- runtime ----
FROM node:20-alpine AS release
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# With outputFileTracingRoot set to the repo root, Next.js standalone output
# mirrors the monorepo structure: server.js lives at apps/2048-next/server.js
# inside .next/standalone/ — so we copy static/public to match that layout.
COPY --from=builder --chown=appuser:appgroup /repo/apps/2048-next/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /repo/apps/2048-next/.next/static ./apps/2048-next/.next/static
COPY --from=builder --chown=appuser:appgroup /repo/apps/2048-next/public ./apps/2048-next/public

USER appuser

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "apps/2048-next/server.js"]
