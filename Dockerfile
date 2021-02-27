FROM node:latest

WORKDIR /usr/src/app
COPY package.json tsconfig.json index.ts .env ./
COPY samples/ ./samples/

RUN apt update && apt install -y build-essential python3-dev python
RUN npm install

CMD ["npm", "run", "start"]
