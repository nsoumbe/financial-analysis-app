# Frontend Dockerfile
FROM node:20-slim
WORKDIR /app

# Install dependencies and build
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Serve static build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
