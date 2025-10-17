# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy root files needed for pnpm workspace install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# copy package.json for workspace members you need to resolve fast
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install all deps (dev + prod) to allow building TS
RUN pnpm install --frozen-lockfile

# copy full repo and build the backend package
COPY . .
RUN pnpm -w -C apps/2048-express run build

# ---- production image ----
FROM node:20-alpine AS release
WORKDIR /app

# enable pnpm in final image
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy only what is needed for runtime
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

# install only production deps
RUN pnpm install --prod --frozen-lockfile

# copy built output
COPY --from=builder /repo/apps/2048-express/dist ./dist

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

# Render and other hosts set PORT; your app reads process.env.PORT
CMD ["pnpm", "start"]
