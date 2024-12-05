# RESCOL (Prototipo)
## Antes de instalar

Para poder ejecutar esta aplicación, es necesario contar con Docker instalado en tu máquina. 

### Prerequisitos

- **Docker**: Asegúrate de tener Docker Desktop instalado. Puedes descargarlo desde el siguiente enlace:

  [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

Una vez que tengas Docker instalado y corriendo, podrás continuar con la instalación de la aplicación.

## Instalación

##### 1. Clonar repositorio o el descragar [archivo ZIP](https://github.com/mnbarrios/RESCOL/archive/refs/heads/main.zip) de la aplicación

```bash
  https://github.com/mnbarrios/RESCOL.git
```

##### 2. En un terminal, dirigirse al directorio del proyecto
```bash
  cd RESCOL
```
##### 3. Ejecutar el siguiente comando para levantar un contenedor docker con la aplicación.
```bash
  docker compose up
```
Esto creará contenedores que dejarán la API, el Front y la Base de datos corriendo de manera local. 

Para acceder a la API ingresea a: http://localhost:8000/api/ 


Para acceder al FRONT ingresea a: http://localhost:3000/


## Crear usuario 
Si es la primera vez que se levanata el contenedor Docker, es necesario registrar un usuario en la aplicación. Para esto, siga los siguientes pasos:

##### 1. Ingrese a http://localhost:8000/api/usuarios/

Allí se listarán todos los usuarios. Si es la primera vez que ingresa aparecerá una lista vacía.

##### 2. Rellene el formulario que se encuentra abajo. Un ejemplo para usuario de prueba es:

| Atributo  | Valor    | 
|-----------|----------|
| ID        | admin   | 
| Password  | admin   | 
| Username  | admin   | 
| Nombre    | test    | 
| Apellido  | test    | 
| Correo    | admin@admin.com   | 
| Admin     | check   | 

En la vista aparecerá un json con un mensaje que dice "usuario creado exitosamente"

Si vuelve a ingresar al link, ahora aparecerá el usuario que acaba de crear.

Felicidades, ya se está listo para utilizar RESCOL de manera local.


## Herramientas Tecnológicas

**Client:** React

**Server:** Django, Docker

