FROM node:lts-slim AS build
RUN apt-get update \
    && apt-get install -y build-essential
WORKDIR /app
COPY package*.json tsconfig.json .
RUN npm install --force
RUN npm install -g typescript
COPY ./src ./src
RUN tsc
ENV PORT=4000
EXPOSE 4000
CMD ["npm", "run", "start"]