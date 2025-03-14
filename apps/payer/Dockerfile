# -----------------------------
# 🔹 Base Stage
# -----------------------------
FROM node:20-alpine AS base

# Set PNPM global path
ENV PNPM_HOME="/var/lib/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


RUN apk update && apk add --no-cache \
  make gcc g++ libc6-compat bash python3 py3-pip \
  linux-headers eudev-dev libusb-dev

RUN npm install -g pnpm@latest && pnpm -g add node-gyp prebuild
# -----------------------------
# 🔹 Builder Stage
# -----------------------------
FROM base AS builder

RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy monorepo packages and apps
COPY apps/payer ./apps/payer
COPY apps/api ./apps/api
COPY packages ./packages


ENV PYTHON=/usr/bin/python3

# Install dependencies
RUN pnpm install --frozen-lockfile

# Move into the  app and build
WORKDIR /app
RUN pnpm run build

# -----------------------------
# 🔹 Runner Stage (Final Container)
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV PORT=3001
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
RUN apk add --no-cache python3 py3-pip libusb eudev

# Copy the built application from the builder stage
COPY --from=builder /app/apps/payer/.next/standalone/ /app

# Ensure the cache directory exists with correct permissions
RUN mkdir -p /app/apps/payer/.next/cache/images && \
  chown -R nextjs:nodejs /app/ && \
  chmod -R 755 /app

USER nextjs

EXPOSE 3001

# Start the Next.js server

CMD ["sh", "-c", "PORT=3001 node apps/payer/server.js"]

