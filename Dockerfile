# Use Node Alpine for smaller image size
FROM node:20-alpine

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy all necessary files from monorepo root
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY ./apps ./apps
COPY ./packages ./packages

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build both apps
RUN pnpm --filter 2048-next build
RUN pnpm --filter 2048-express build

# Expose ports for frontend and backend
EXPOSE 3000 3001

# Start both apps with a simple script
CMD ["sh", "-c", "pnpm --filter 2048-express start & pnpm --filter 2048-next start"]
