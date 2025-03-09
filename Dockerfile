FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g concurrently serve

WORKDIR /app/client
RUN npm install
RUN npm run build --verbose

WORKDIR /app

EXPOSE 3000
EXPOSE 5000

CMD ["npm", "run", "prod"]