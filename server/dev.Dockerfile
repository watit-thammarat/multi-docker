FROM node:alpine

RUN mkdir /app
WORKDIR  /app
COPY ./package.json ./
RUN npm i

# COPY  ./ ./

CMD ["npm", "run", "dev"]