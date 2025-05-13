# 🐾 AdoptMe Backend

Este proyecto es un backend para gestionar usuarios y mascotas, con funcionalidades avanzadas como mockeo de datos para testing y desarrollo.

---

## 📋 Menú

- [🔐 CREDENCIALES - .env](#credenciales)
- [🔧 Instalación](#-instalación)
- [🧪 Funcionalidad de Mocking](#-funcionalidad-de-mocking)
  - [📍 Endpoint `/api/mocks/mockingusers`](#endpoint-apimocksmockingusers)
  - [📍 Endpoint `/api/mocks/mockingpets`](#endpoint-apimocksmockingpets)
  - [📍 Endpoint `/api/mocks/generateData`](#endpoint-apimocksgeneratedata)
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

<a name="instalacionlocal"></a>

## 🔧 Instalación

### **Prerequisitos:**

Antes de instalar la aplicación, asegúrate de contar con:

- Un editor de código como **Visual Studio Code** o similar.
- **Node.js** y **npm** instalados en tu sistema.

### **Pasos para la instalación:**

1. **Ubicar el directorio de instalación:**  
   En tu terminal o consola, navega hasta la carpeta donde deseas instalar la aplicación.

2. **Clonar el repositorio:**  
   Ejecuta el siguiente comando para clonar el proyecto:

   ```
     git clone https://github.com/hmfarias/adoptme.git
   ```

   Esto creará una carpeta llamada "adoptme" con todos los archivos de la aplicación.

3. **Abrir el proyecto en el editor de código:**
   Abre Visual Studio Code (o tu editor de preferencia) y selecciona la carpeta "adoptme".

4. **Abrir una terminal en la carpeta del proyecto:**
   Asegúrate de estar ubicado dentro de la carpeta "adoptme" en la terminal.

5. **Instalar las dependencias:**

   Ejecuta el siguiente comando para instalar las dependencias del proyecto:

   ```
   npm install
   ```

6. **Configurar las variables de entorno:**
   Crea un archivo .env en la raíz del proyecto con la configuración de las credenciales (ver sección CREDENCIALES (.env)).
   Consulta la configuración de credenciales en la sección [CREDENCIALES (.env)](#credenciales).
7. **Iniciar la aplicación en modo desarrollador:**
   Ejecuta el siguiente comando:

   ```
   npm run dev
   o bien:
   node src/app.js
   ```

   Esto iniciará el servidor y mostrará un mensaje en la terminal indicando que la aplicación está corriendo en el puerto 8080 y conectada a la base de datos.

✅ ¡Listo! Ya puedes explorar y probar la aplicación en tu entorno local. 🚀

[Volver al menú](#top)

---

## 🧪 Funcionalidad de Mocking

Este sistema permite generar datos falsos para pruebas o poblar la base de datos en desarrollo.

<a name="endpoint-apimocksmockingusers"></a>

### 📍 Endpoint `/api/mocks/mockingusers/:quantity`

**Método:** `GET`

**Descripción:** Genera usuarios falsos de acuerdo a la catidad recibida por query param "quantity", con las siguientes características:

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

<a name="endpoint-apimocksmockingpets"></a>

### 📍 Endpoint `/api/mocks/mockingpets/:quantity`

**Método:** `GET`

**Descripción:** Genera mascotas falsas de acuerdo a la cantidad recibida por query param "quantity", con los siguientes campos:

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

<a name="endpoint-apimocksgeneratedata"></a>

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

[Volver al menú](#top)

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

[Volver al menú](#top)
