# 📦 AdoptMe Backend

Este proyecto es un backend para gestionar usuarios y mascotas, con funcionalidades avanzadas como mockeo de datos para testing y desarrollo.

---

## 📋 Menú
- [🔐 CREDENCIALES - .env](#credenciales)
- [🔧 Instalación](#-instalación)
- [🚀 Ejecución](#-ejecución)
- [📁 Estructura del proyecto](#-estructura-del-proyecto)
- [🧪 Funcionalidad de Mocking](#-funcionalidad-de-mocking)
  - [📍 Endpoint `/api/mocks/mockingusers`](#-endpoint-apimocksmockingusers)
  - [📍 Endpoint `/api/mocks/mockingpets`](#-endpoint-apimocksmockingpets)
  - [📍 Endpoint `/api/mocks/generateData`](#-endpoint-apimocksgeneratedata)
- [📦 Utilidades](#-utilidades)
- [🪵 Manejo de errores](#-manejo-de-errores)


<a name="credenciales"></a>

## 🔐 CREDENCIALES (archivo .env)

Antes de ejecutar la aplicación, es necesario crear un archivo .env en la carpeta raíz (donde se encuentra el package.json). Este archivo almacenará las variables de entorno necesarias para la configuración del servidor y la conexión a la base de datos. CON FINES DIDÁCTICOS SE DETALLA SU CONTENIDO PARA PODER PROBAR LA APLICACIÓN.

### 🟢 Contenido que debe tener el archivo .env:

```
/**
* Environment variables
*/
# Server Configuration
PORT=8080

SECRET_KEY="X9v$3jK@pLm7!zQwT2"

# Database Configuration
DB_USER=hmfarias
DB_PASSWORD=QQATDs4SdAAWYa23
DB_HOST=cluster0.fergg.mongodb.net
APP_NAME=Cluster0
DB_NAME=backendII
```

Este archivo a su vez es procesado por `/src/config/config.js`, que es quien finalmente se encarga de cargar las variables de entorno y configurar los valores necesarios para el funcionamiento de la aplicación, como el puerto del servidor y la conexión a la base de datos.

[Volver al menú](#top)

---

## 🔧 Instalación

```bash
npm install
```

Asegúrate de tener tu archivo `.env` configurado correctamente.

---

## 🚀 Ejecución

```bash
npm run dev
```

---

## 📁 Estructura del proyecto

```
src/
├── controllers/
│   └── mocks.controller.js
├── dao/
│   ├── Users.dao.js
│   └── Pets.dao.js
├── dto/
│   └── Pet.dto.js
├── repository/
│   ├── UserRepository.js
│   └── PetRepository.js
├── routers/
│   └── mocks.router.js
├── services/
│   └── index.js
├── utils.js
└── ...
```

---

## 🧪 Funcionalidad de Mocking

Este sistema permite generar datos falsos para pruebas o poblar la base de datos en desarrollo.

### 📍 Endpoint `/api/mocks/mockingusers`

**Método:** `GET`

**Descripción:** Genera 50 usuarios falsos con las siguientes características:

- `password` es siempre `"coder123"` (encriptada).
- `role`: `"user"` o `"admin"`.
- `pets`: array vacío.

**Ejemplo de respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "first_name": "Laura",
      "last_name": "Meier",
      "email": "laura.meier@example.com",
      "password": "$2b$10$...",
      "role": "user",
      "pets": []
    }
  ]
}
```

---

### 📍 Endpoint `/api/mocks/mockingpets`

**Método:** `GET`

**Descripción:** Genera 100 mascotas falsas con los siguientes campos:

- `name`, `specie`, `birthDate`, `image`
- `adopted`: siempre `false`
- No incluye `owner`

**Ejemplo de respuesta:**
```json
{
  "status": "success",
  "payload": [
    {
      "name": "Milo",
      "specie": "dog",
      "birthDate": "2018-04-21T00:00:00.000Z",
      "adopted": false,
      "image": "https://picsum.photos/id/23/400/400"
    }
  ]
}
```

---

### 📍 Endpoint `/api/mocks/generateData`

**Método:** `POST`

**Ruta:** `/api/mocks/generateData`

**Parámetros:**
```json
{
  "users": 10,
  "pets": 20
}
```

**Descripción:** Inserta directamente en la base de datos la cantidad de usuarios y mascotas especificados.

**Respuesta:**
```json
{
  "status": "success",
  "usersCreated": 10,
  "petsCreated": 20
}
```

---

## 📦 Utilidades

- `generateFakeUser()`  
  Usa Faker + bcrypt para generar un usuario falso con contraseña encriptada.

- `generateFakePet()`  
  Usa Faker para crear mascotas con datos realistas.

---

## 🪵 Manejo de errores

El sistema utiliza un logger diario en `src/logs/AAAA-MM-DD.log` para registrar errores del servidor con `timestamp`, `mensaje`, y `stack`.

---

## 📫 Contacto

¿Dudas o sugerencias? No dudes en abrir un issue o contactarme directamente.
