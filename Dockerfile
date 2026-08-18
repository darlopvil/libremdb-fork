# Thanks @yordis on Github! https://github.com/vercel/next.js/discussions/16995#discussioncomment-132339
# Install dependencies only when needed
# NOTA: se usan imágenes Debian (slim) en lugar de Alpine porque sharp compila
# binarios nativos específicos de la libc. Instalarlos en Alpine (musl) y
# ejecutarlos en un runtime Debian (glibc) hace que sharp procese mal el color y
# sirva las imágenes en blanco y negro a través de /_next/image.
FROM node:20-slim AS deps
WORKDIR /opt/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-slim AS builder
ENV NODE_ENV=production
WORKDIR /opt/app
RUN npm install -g pnpm
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN pnpm build

# Production image, copy all the files and run next
FROM node:20-slim AS runner
ARG X_TAG
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.mjs ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["./node_modules/next/dist/bin/next", "start"]