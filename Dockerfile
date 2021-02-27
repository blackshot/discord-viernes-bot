FROM node:latest
ENV DS_TOKEN NDg4NDcyNzY0ODA2NzI1NjYz.W5Wbtg.1TImm_tLOgonsdSk-XTt3NPy3uI

WORKDIR /usr/src/app
COPY package.json tsconfig.json index.ts .env ./
COPY samples/ ./samples/

RUN apt update && apt install -y build-essential python3-dev python
RUN npm install

CMD ["npm", "run", "start"]
