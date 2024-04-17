FROM node:alpine AS development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/


RUN yarn install

COPY . .

RUN yarn run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/


RUN yarn install --only=prod


COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]