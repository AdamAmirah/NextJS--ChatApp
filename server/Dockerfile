FROM node:16-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=src/prisma/schema.prisma

EXPOSE 4000

CMD npm run dev