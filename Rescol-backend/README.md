# RESCOL BACKEND

Arquitectura interna de RESCOL. Administra toda la lógica de la aplicación.


## Ejecutar localmente

Clonar el repositorio

```bash
  git clone https://github.com/mnbarrios/Rescol-backend.git
```


Ir al directorio del proyecto

```bash
  cd Rescol-backend
```

Instalar dependencias

```bash
  pip install -r requirements.txt
```

Iniciar el servidor

```bash
  python3 manage.py makemigrations api
  python3 manage.py migrate
```
