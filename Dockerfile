# Imagen base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la app
COPY . .

# Exponer el puerto
EXPOSE 8080

# Comando para iniciar la app
CMD ["npm", "run", "prod"]