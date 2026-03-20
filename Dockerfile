FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build

FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

WORKDIR /app
COPY backend ./backend
COPY python-service ./python-service
COPY --from=frontend-builder /app/frontend/build ./frontend/build

WORKDIR /app/python-service
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

WORKDIR /app/backend
ENV PYTHON_PATH=python3
EXPOSE 5000

CMD ["node", "server.js"]
