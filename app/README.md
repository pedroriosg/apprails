# Documentación

# Inicializar proyecto

    Se debe tener un archivo .env con las variables de entorno:
    
    - DB_USER
    - DB_PASSWORD
    - DB_NAME
    - JWT_SECRET

    Teniendo eso, se deben ejecutar los siguientes comandos:

    - yarn install                    (instalar dependencias)
    - yarn db:setup                   (bases de datos)

    En caso de que se quiera borrar la base de datos y resetear comandos

    - yarn db:reset

    - yarn dev                        (inicializar backend en  localhost:3000)