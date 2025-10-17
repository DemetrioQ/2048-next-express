# builder
FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

# copy workspace manifests for cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install workspace deps to build
RUN pnpm install --frozen-lockfile

# copy repo and build the backend package
COPY . .
RUN pnpm -C apps/2048-express run build

# create a package-local production node_modules for the app
RUN pnpm -C apps/2048-express install --prod --no-frozen-lockfile --prefer-offline

# final image
FROM node:20-alpine AS release
WORKDIR /app

# copy built output
COPY --from=builder /repo/apps/2048-express/dist ./dist
COPY --from=builder /repo/apps/2048-express/package.json ./package.json
# copy package-local production node_modules
COPY --from=builder /repo/apps/2048-express/node_modules ./node_modules

# non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/apps/2048-express/src/app.js"]
