FROM node:22-alpine AS builder

WORKDIR /app

# To build the nestjs application we need the @nestjs/cli which is a dev dependencies
COPY --chown=node:node package*.json ./

# Dev dependencies are required to build the application
RUN npm install --no-audit --save-dev

COPY --chown=node:node . .

RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV PORT=3000
EXPOSE $PORT

USER root

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY --chown=node:node --from=builder /app/*.json ./
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

# Remove dev dependencies from the production image
RUN npm prune

USER node

CMD [ "npm", "run", "start:prod" ]
