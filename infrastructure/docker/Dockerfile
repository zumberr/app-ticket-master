FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY backend/package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY backend/src ./src
COPY backend/.env.example ./.env

# Crear directorio de logs
RUN mkdir -p logs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usuario no root
USER node

CMD ["node", "src/app.js"]
