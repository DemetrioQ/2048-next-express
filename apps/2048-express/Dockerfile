# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

# workspace manifests for cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install all deps (dev + prod) to build
RUN pnpm install --frozen-lockfile

# copy repo and build the backend package
COPY . .
RUN pnpm -C apps/2048-express run build

# prune dev deps to keep only production modules (keeps pnpm symlink layout)
RUN pnpm prune --prod

# ---- final image ----
FROM node:20-alpine AS release
WORKDIR /app

# copy built output
COPY --from=builder /repo/apps/2048-express/dist ./dist
COPY --from=builder /repo/apps/2048-express/package.json ./package.json

# copy pnpm runtime artifacts so symlinks in node_modules resolve
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/.pnpm-store /root/.pnpm-store   

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

# adjust to the actual built entry
CMD ["node", "dist/apps/2048-express/src/app.js"]
