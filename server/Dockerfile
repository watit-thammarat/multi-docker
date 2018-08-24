FROM node:alpine

RUN mkdir /app
WORKDIR  /app
COPY  ./ ./
RUN npm i

CMD ["npm", "run", "start"]