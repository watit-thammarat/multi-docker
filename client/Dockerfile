FROM node:alpine as builder

RUN mkdir /app
WORKDIR  /app
COPY ./ ./
RUN npm i
RUN npm run build

FROM nginx
EXPOSE 3000
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf