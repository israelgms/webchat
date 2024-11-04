# Use uma imagem do Node.js como base
FROM node:18-alpine

# Cria um diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o container
COPY . .

# Compila o código TypeScript
RUN npm run build

# Expõe a porta que o NestJS vai usar
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]