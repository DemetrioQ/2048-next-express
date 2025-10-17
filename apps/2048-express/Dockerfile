# builder
FROM node:20-alpine AS builder
WORKDIR /repo

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy workspace manifests for cached install
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/2048-express/package.json apps/2048-express/package.json
COPY packages/shared-2048-logic/package.json packages/shared-2048-logic/package.json

# install all deps for build
RUN pnpm install --frozen-lockfile

# copy repo and build the backend package
COPY . .

# run the package build
RUN pnpm -C apps/2048-express run build

# consolidate build output into a predictable folder and prune dev deps
RUN mkdir -p /repo/build/dist \
  && if [ -d "./apps/2048-express/dist" ]; then cp -r ./apps/2048-express/dist/* /repo/build/dist/; fi \
  && if [ -d "./dist/apps/2048-express" ]; then cp -r ./dist/apps/2048-express/* /repo/build/dist/; fi \
  && pnpm prune --prod

# final image
FROM node:20-alpine AS release
WORKDIR /app

# copy runtime files (built output + production node_modules)
COPY --from=builder /repo/build/dist ./dist
COPY --from=builder /repo/node_modules ./node_modules
COPY apps/2048-express/package.json ./package.json

# non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 8000

# Adjust this path if your compiled entry is at a different location.
# Common alternatives: "node dist/src/app.js" or "node dist/app.js"
CMD ["node", "dist/apps/2048-express/src/app.js"]
