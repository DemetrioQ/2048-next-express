# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy root workspace files for cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install deps (dev + prod) to build
RUN pnpm install --frozen-lockfile

# copy rest of repo and build backend
COPY . .
RUN pnpm -w -C apps/2048-express run build

# remove dev deps to keep node_modules production-only
RUN pnpm prune --prod

# ---- final image ----
FROM node:20-alpine AS release
WORKDIR /app

# copy runtime package.json (optional) and built output
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY --from=builder /repo/apps/2048-express/dist ./dist

# copy pruned node_modules from builder (production-only)
COPY --from=builder /repo/node_modules ./node_modules

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

# Use package start or node directly; adjust if your entry differs
CMD ["node", "dist/app.js"]
