# Backend Dockerfile
FROM node:20-slim

# Install Python for the analyzer service
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy backend and python-service code
WORKDIR /app
COPY backend ./backend
COPY python-service ./python-service

# Install python requirements
WORKDIR /app/python-service
RUN pip3 install --no-cache-dir -r requirements.txt

WORKDIR /app/backend
EXPOSE 5000

ENV PYTHON_PATH=python3
CMD ["node", "server.js"]
