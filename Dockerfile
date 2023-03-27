# Use una imagen oficial de Node.js como base
FROM node:16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Construir la aplicación
RUN npm run build

# Cambiar a la imagen oficial de Nginx para servir la aplicación construida
FROM nginx:1.21

# Copiar la aplicación construida al directorio de contenido de Nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
