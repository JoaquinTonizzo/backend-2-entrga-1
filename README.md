# User CRUD con Autenticación (JWT + Passport)

Proyecto que implementa un CRUD de usuarios con autenticación y autorización usando Passport y JWT. Incluye:

- Modelo `User` (Mongoose) con hashing de contraseña usando `bcrypt`.
- Estrategias de Passport: `login` (local) y `current` (JWT).
- Endpoints:
  - `POST /api/users` - crear usuario (registro)
  - `GET /api/users` - listar usuarios
  - `GET /api/users/:id` - ver usuario
  - `PUT /api/users/:id` - actualizar usuario
  - `DELETE /api/users/:id` - borrar usuario
  - `POST /api/sessions/login` - login (devuelve JWT)
  - `GET /api/sessions/current` - valida JWT y devuelve datos del usuario

Instalación

1. Copiar `.env.example` a `.env` y configurar MONGODB_URI y JWT_SECRET.
2. Instalar dependencias:

```powershell
npm install
```

3. Ejecutar en modo desarrollo:

```powershell
npm run dev
```

Pruebas rápidas

- Registrar un usuario:
  POST /api/users
  body: { first_name, last_name, email, age, password }
- Login:
  POST /api/sessions/login
  body: { email, password }
  -> devuelve { token }
- Obtener current:
  GET /api/sessions/current
  Header: Authorization: Bearer <token>

Notas

- La contraseña se encripta usando `bcrypt.hashSync` en el hook `pre('save')` del modelo.
- La estrategia JWT se registró con el nombre `current` para cumplir la consigna.
