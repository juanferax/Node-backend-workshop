# Taller Backend con Node

## Descripción
Aplicación backend robusta con Node.js, que utiliza TypeScript para un tipado
fuerte y MongoDB para la persistencia de datos. La aplicación permite realizar operaciones
CRUD (Crear, Leer, Actualizar, Eliminar) en usuarios y grupos, manejar la autenticación de
usuarios, y permitir la asociación entre usuarios y grupos, así como la consulta de dichas
asociaciones. Sólo los usuarios con rol de superadmin pueden crear usuarios.

En el siguiente enlace podrá encontrar un video demostrando el funcionamiento de la aplicación: https://drive.google.com/file/d/1a-XRFHkMfN1wGGalGHkU6AuIwISri1h5/view?usp=sharing

## Configuración y Ejecución del proyecto
1. Clonar el proyecto con `git clone https://github.com/juanferax/Node-backend-workshop`
2. Asegurarse de tener MongoDB instalado en tu equipo, en caso de querer usar un servidor mongo externo modificar el archivo `/config/connect.ts` con la URI de su base de datos.
3. Moverse a la carpeta raíz del proyecto e instalar las dependencias con el comando `yarn`
4. Para correr el proyecto ejecutamos el script de inicialización con `yarn dev`

## Endpoints
### Login
- POST /login
  ```json
  {
    "email":"<email>",
    "password":"<password>"
  }
  ```

### Usuarios
- GET /users<br>
- POST /users<br>
  ```json
  {
    "name":"<name>",
    "email":"<email>",
    "password":"<password>"
  }
  ```
- GET /users/:id<br>
- PUT /users/:id<br>
  ```json
  {
    "name":"<name>",
    "email":"<email>",
    "password":"<password>"
  }
  ```
- DELETE /users/:id<br>
- GET /users/:id/groups

### Grupos
- GET /groups<br>
- POST /groups<br>
  ```json
  {
    "name": "<name>",
    "users": [
      "<userId>"
    ]
  }
  ```
- GET /groups/:id<br>
- PUT /groups/:id<br>
  ```json
  {
    "name": "<name>",
    "users": [
      "<userId>"
    ]
  }
  ```
- DELETE /groups/:id<br>
- GET /groups/:id/users
