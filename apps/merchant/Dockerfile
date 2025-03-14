# -----------------------------
# 🔹 Base Stage
# -----------------------------
FROM node:20-alpine AS base

# Set PNPM global path
ENV PNPM_HOME="/var/lib/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@latest

# -----------------------------
# 🔹 Builder Stage
# -----------------------------
FROM base AS builder

RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy monorepo packages and apps
COPY apps/merchant ./apps/merchant
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Move into the merchant app and build
WORKDIR /app/apps/merchant
RUN pnpm run build

# -----------------------------
# 🔹 Runner Stage (Final Container)
# -----------------------------
FROM node:22-slim AS runner

WORKDIR /app

ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy the built application from the builder stage
COPY --from=builder /app/apps/merchant/.next/standalone/ /app

# Ensure the cache directory exists with correct permissions
RUN mkdir -p /app/.next/cache/images && \
  chown -R nextjs:nodejs /app/.next && \
  chmod -R 755 /app/.next

USER nextjs

EXPOSE 3000

# Start the Next.js server
CMD ["node", "apps/merchant/server.js"]

