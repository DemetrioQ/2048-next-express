FROM node:23-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./



COPY ./apps/2048-express /app/apps/2048-express
COPY ./packages/shared-2048-logic /app/packages/shared-2048-logic

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/2048-express

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then pnpm build; fi

EXPOSE 8000

# Default to development
CMD ["pnpm", "dev"]
