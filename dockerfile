FROM node:18.16.0-alpine3.18

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

RUN npm install

RUN mkdir prisma

COPY prisma/ prisma/

RUN npx prisma generate

RUN mkdir target

COPY target/ target/

ENV DATABASE_URL="mysql://sysuser:sysadmin1@e-medhistory.c40gsqewozq1.me-central-1.rds.amazonaws.com:3306/e-medhistory"

CMD [ "node","target/index.js" ]

