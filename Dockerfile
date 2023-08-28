# Utiliza una imagen base con soporte para servir contenido estático
FROM nginx:alpine

# Copia el archivo HTML al directorio de contenido estático de Nginx
COPY index.html /usr/share/nginx/html

# Expone el puerto 80 para que pueda ser accesible desde el host
EXPOSE 80

# Comando para iniciar el servidor Nginx al ejecutar el contenedor
CMD ["nginx", "-g", "daemon off;"]
