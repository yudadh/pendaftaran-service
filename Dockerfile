FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Jalankan prisma generate untuk client
RUN npx prisma generate

RUN npm run build

EXPOSE 8080
CMD ["node", "dist/server.js"]