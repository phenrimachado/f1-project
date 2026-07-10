FROM node:20-alpine

WORKDIR /app

# Em dev o codigo vem via volume (docker-compose.yml); isso aqui garante que a
# imagem builda mesmo antes do "create-next-app" ser rodado pela primeira vez.
COPY package*.json ./

RUN if [ -f package.json ]; then npm install; fi

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
