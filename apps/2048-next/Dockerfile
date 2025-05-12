FROM node:23-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/apps/2048-next

COPY ./apps/2048-next  /app/apps/2048-next
COPY ./packages/shared-2048-logic /app/packages/shared-2048-logic

RUN pnpm install


# Build only in production mode
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then pnpm build; fi

EXPOSE 3000

CMD ["pnpm", "dev"]