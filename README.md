# RESCOL (Prototipo)
## Antes de instalar

Para poder ejecutar esta aplicación, es necesario contar con Docker instalado en tu máquina. 

### Prerequisitos

- **Docker**: Asegúrate de tener Docker Desktop instalado. Puedes descargarlo desde el siguiente enlace:

  [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

Una vez que tengas Docker instalado y corriendo, podrás continuar con la instalación de la aplicación.

## Instalación

##### 1. Clonar repositorio o descragar [archivo ZIP](https://github.com/mnbarrios/RESCOL/archive/refs/heads/main.zip) de la aplicación

```bash
  https://github.com/mnbarrios/RESCOL.git
```

##### 2. En un terminal, dirigirse al directorio del proyecto
```bash
  cd RESCOL
```
##### 3. Ejecutar los siguientes comandos para levantar un contenedor docker con la aplicación:
  - Creación de imagen:
    ```bash
    docker compose build --no-cache
    ```
- Creación del contenedor:
  ```bash
    docker compose create 
  ```

##### 4. Gestión de los contenedores desde la aplicación:
- Los contenedores pueden **iniciarse**, **detenerse** o **pausarse** directamente desde la interfaz de la aplicación según sea necesario.
- Alternativamente, puedes realizar estas acciones desde el terminal utilizando los siguientes comandos:

  Iniciar los contenedores pausados:
  ```bash
  docker compose start
  ```
  Pausar los contenedores:
  ```bash
  docker compose pause
  ```
  Detener los contenedores:
  ```bash
  docker compose stop
  ```
  Eliminar completamente los contenedores:
  ```bash
  docker compose down
  ```



Para acceder a la API ingresea a: http://localhost:8000/api/ 


Para acceder al FRONT ingresea a: http://localhost:3000/

> **Nota:** Al iniciar los contenedores, es recomendable esperar unos minutos antes de intentar acceder a los enlaces proporcionado. Los contenedores pueden tardar un poco en arrancar completamente, por lo que es posible que no respondan inmediatamente después de ser iniciados.


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

## Subir Redes Viales

Dentro de la carpeta principal encontrará una subcarpeta llamada `Redes Viales`, en la cual están disponibles tres archivos `.zip` que puede utilizar como pruebas:

- **CN.zip**: Contiene las calles de Cerronavia.
- **QN.zip**: Contiene las calles de Quinta Normal.
- **CNQN.zip**: Corresponde a la red colaborativa (combinación de CN y QN).

Estos archivos están a su disposición para probar la aplicación.

### Instrucciones para subir redes viales

1. Abra la aplicación y vaya a la pestaña **Redes**.
2. Seleccione la opción **Agregar Red**.
3. Suba el archivo `.zip` correspondiente.
4. Asigne un nombre a la red.
5. Indique si la red es colaborativa marcando la opción correspondiente.

> **Nota:** Si la red que desea cargar es colaborativa (por ejemplo, **CNQN.zip**), es necesario que las redes individuales (**CN.zip** y **QN.zip**) hayan sido subidas previamente. 

6. **Adicional:** Si la red es colaborativa, selecione las redes individuales que la conforman.

¡Listo! Ahora podrá trabajar con las redes viales cargadas en la aplicación.


## Herramientas Tecnológicas

**Client:** React

**Server:** Django, Docker

