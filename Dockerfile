# ==============================================================================
# GOR MARKETING - KOWALSKI 3.0 PRODUCTION DOCKERFILE
# ==============================================================================
FROM node:20-alpine

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache tzdata ca-certificates ffmpeg

ENV TZ=Asia/Jerusalem
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "bot.js"]
