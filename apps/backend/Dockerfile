# Diseñado por: Edward Labrador
# Para Unión de Comerciantes del Estado Zulia
# Versión: 1.0.0
# Todos los Derechos Reservados UCEZ 2026

# ── Etapa 1: Build ──────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

RUN npm install -g pnpm@11.8.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

RUN pnpm --filter backend run build

# ── Etapa 2: Runtime ────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

RUN npm install -g pnpm@11.8.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma

RUN pnpm install --frozen-lockfile --prod

COPY packages/shared ./packages/shared
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

RUN npx prisma generate

RUN mkdir -p uploads/receipts

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
