# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps (layer-cached until manifests change)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

RUN pnpm install --frozen-lockfile

# Copy sources and build
COPY packages/shared-2048-logic packages/shared-2048-logic
COPY apps/2048-express apps/2048-express

RUN pnpm --filter shared-2048-logic build
RUN pnpm --filter 2048-express build

# Produce a flat, production-only node_modules for the express app
RUN pnpm -C apps/2048-express install --prod --no-frozen-lockfile --prefer-offline --shamefully-hoist

# ---- runtime ----
FROM node:20-alpine AS release
WORKDIR /app

# Production node_modules (flat/hoisted, no devDeps)
COPY --from=builder /repo/apps/2048-express/node_modules ./node_modules
COPY --from=builder /repo/node_modules ./node_modules

# Compiled output (TypeScript compiles with monorepo rootDir, so dist mirrors the repo layout)
COPY --from=builder /repo/apps/2048-express/dist ./dist
COPY --from=builder /repo/packages/shared-2048-logic/dist ./shared-logic-dist

# Runtime path alias: require('src/...') → compiled src files
# The TypeScript path alias 'src/*' is not transformed by tsc — we wire it via node_modules
RUN mkdir -p /app/node_modules \
 && ln -s /app/dist/apps/2048-express/src /app/node_modules/src

# Runtime path alias: require('shared-2048-logic/...') → compiled shared package
RUN mkdir -p /app/node_modules/shared-2048-logic \
 && cp -r /app/shared-logic-dist/. /app/node_modules/shared-2048-logic/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

# dist/apps/2048-express/src/app.js — TypeScript rootDir inferred as repo root
CMD ["node", "dist/apps/2048-express/src/app.js"]
