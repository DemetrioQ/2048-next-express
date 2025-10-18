# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /repo

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy workspace manifests for cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install whole workspace (dev + prod) so we can build TS in all packages
RUN pnpm install --frozen-lockfile

# copy repo and build packages
COPY . .

# build shared package and backend
RUN pnpm -C packages/shared-2048-logic run build
RUN pnpm -C apps/2048-express run build

# create package-local production modules for the backend
RUN pnpm -C apps/2048-express install --prod --no-frozen-lockfile --prefer-offline --shamefully-hoist

# ---- final image ----
FROM node:20-alpine AS release
WORKDIR /app

# copy compiled app and compiled shared package
COPY --from=builder /repo/apps/2048-express/dist ./dist/apps/2048-express
COPY --from=builder /repo/packages/shared-2048-logic/dist ./dist/packages/shared-2048-logic

# copy package.json and the app-local production node_modules
COPY --from=builder /repo/apps/2048-express/package.json ./package.json
COPY --from=builder /repo/apps/2048-express/node_modules ./node_modules
COPY --from=builder /repo/node_modules /node_modules

# create module-name mappings so runtime require('src/...') and
# require('shared-2048-logic/...') resolve to the compiled JS
RUN mkdir -p /app/node_modules \
 && if [ -d "/app/dist/apps/2048-express/apps/2048-express/src" ]; then \
      ln -s /app/dist/apps/2048-express/apps/2048-express/src /app/node_modules/src; \
    elif [ -d "/app/dist/apps/2048-express/src" ]; then \
      ln -s /app/dist/apps/2048-express/src /app/node_modules/src; \
    else \
      echo "warning: compiled src folder not found; check build output"; \
    fi \
 && mkdir -p /app/node_modules/shared-2048-logic \
 && cp -r /app/dist/packages/shared-2048-logic/* /app/node_modules/shared-2048-logic/

# drop to non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

CMD ["node", "dist/apps/2048-express/apps/2048-express/src/app.js"]
