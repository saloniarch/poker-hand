FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies inside container (native modules get built for Linux)
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
