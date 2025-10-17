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

# build shared package and backend
RUN pnpm -C packages/shared-2048-logic run build
RUN pnpm -C apps/2048-express run build

# create package-local production node_modules
RUN pnpm -C apps/2048-express install --prod --no-frozen-lockfile --prefer-offline

# final image
FROM node:20-alpine AS release
WORKDIR /app

# copy compiled code and app-local production node_modules
COPY --from=builder /repo/apps/2048-express/dist ./dist
COPY --from=builder /repo/apps/2048-express/package.json ./package.json
COPY --from=builder /repo/apps/2048-express/node_modules ./node_modules

# ensure module-alias is available and register it at runtime
CMD ["node", "-r", "module-alias/register", "dist/apps/2048-express/src/app.js"]
