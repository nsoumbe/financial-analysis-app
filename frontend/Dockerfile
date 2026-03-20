FROM node:20-bookworm-slim AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080
