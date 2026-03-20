FROM node:20-bookworm-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:${PATH}"

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-venv ca-certificates \
  && python3 -m venv /opt/venv \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

WORKDIR /app/python-service
COPY python-service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

WORKDIR /app
COPY backend ./backend
COPY python-service ./python-service

RUN useradd --create-home --shell /usr/sbin/nologin appuser \
  && chown -R appuser:appuser /app

WORKDIR /app/backend
ENV PYTHON_PATH=python

USER appuser
EXPOSE 5000

CMD ["node", "server.js"]
