FROM node:18-alpine as builder
WORKDIR /app
RUN apk add --no-cache npm
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./src/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
