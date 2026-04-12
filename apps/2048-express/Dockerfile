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

# pnpm deploy produces a self-contained directory with fully resolved,
# non-symlinked production node_modules — safe to COPY across Docker stages
RUN pnpm deploy --filter=2048-express --prod /prod/express

# ---- runtime ----
FROM node:20-alpine AS release
WORKDIR /app

# Clean production node_modules (no pnpm virtual store, no broken symlinks)
COPY --from=builder /prod/express/node_modules ./node_modules

# Compiled output (TypeScript rootDir spans monorepo, so dist mirrors repo layout)
COPY --from=builder /repo/apps/2048-express/dist ./dist

# Compiled shared package
COPY --from=builder /repo/packages/shared-2048-logic/dist ./shared-logic-dist

# Runtime path alias: require('src/...') → compiled src files
# tsc does not transform path aliases, so we wire them via node_modules
RUN ln -s /app/dist/apps/2048-express/src /app/node_modules/src

# Runtime path alias: require('shared-2048-logic/...') → compiled shared package
RUN mkdir -p /app/node_modules/shared-2048-logic \
 && cp -r /app/shared-logic-dist/. /app/node_modules/shared-2048-logic/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/apps/2048-express/src/app.js"]
