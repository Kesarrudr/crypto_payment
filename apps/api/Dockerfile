# Stage 1: Base setup
FROM node:22-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install dependencies
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy all necessary files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Stage 2: Install production dependencies only
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  PNPM_CONFIG_VERIFY_STORE_INTEGRITY=false pnpm install --frozen-lockfile --prod

# Stage 3: Install all dependencies and build API
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  PNPM_CONFIG_VERIFY_STORE_INTEGRITY=false pnpm install --frozen-lockfile

# ✅ Generate Prisma Client using correct schema path
WORKDIR /app/packages/database
RUN pnpm prisma generate --schema=prisma/schema.prisma

# Move to API directory
WORKDIR /app/apps/api

# Build the API
RUN pnpm run build

# Stage 4: Final runtime image
FROM node:22-slim AS runner
RUN apt-get update -y && apt-get install -y openssl
# Set working directory
WORKDIR /app

# Copy necessary runtime files
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/apps/api/dist /app/dist
COPY --from=build /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=build /app/apps/api/package.json /app/package.json

# ✅ Copy Prisma schema and generated client to the final container
COPY --from=build /app/packages/database/generated/client /app/packages/database/generated/client
COPY --from=build /app/packages/database/prisma /app/
COPY --from=build /app/packages/database/node_modules/ /app/node_modules/

# Set environment variables for correct module resolution
ENV NODE_PATH=/app/apps/api/node_modules
ENV PATH=$NODE_PATH/.bin:$PATH

# Expose the application port
EXPOSE 8082

# Start the server
CMD ["node", "dist/server.js"]

