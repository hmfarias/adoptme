# 🐾 AdoptMe Backend

Este proyecto es un backend para gestionar usuarios y mascotas, con funcionalidades avanzadas como mockeo de datos para testing y desarrollo.

---

## 📋 Menú

- [🔐 CREDENCIALES - .env](#credenciales)
- [🔧 Instalación](#-instalación)
- ⚙️ [Configuración del Puerto desde Línea de Comandos](#comander)
- [🧪 Funcionalidad de Mocking](#-funcionalidad-de-mocking)
  - [📍 Endpoint `/api/mocks/mockingusers`](#endpoint-apimocksmockingusers)
  - [📍 Endpoint `/api/mocks/mockingpets`](#endpoint-apimocksmockingpets)
  - [📍 Endpoint `/api/mocks/generateData`](#endpoint-apimocksgeneratedata)
- [📦 Utilidades](#-utilidades)
- 🛑 [Manejo de errores inesperados - LOG](#erroresinesperados)
- 📬 [Postman Collection para hacer las pruebas](#postman)

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

<a name="comander"></a>

## ⚙️ Configuración del Puerto desde Línea de ComandosL

La aplicación permite establecer el puerto en el que se ejecuta el servidor de forma dinámica a través de la línea de comandos, gracias al uso de la librería **commander**.

🛠️ Prioridad de asignación del puerto:

1. Parámetro pasado por CLI → node src/app.js --port 4000
2. Variable de entorno .env → PORT= 8080
3. Valor por defecto → 8080

```
# Usando la opción larga
node src/app.js --port 4000
o bien:
npm run dev -- --port 4000

# Usando la opción corta
node src/app.js -p 4000
o bien:
npm run dev -- -p 4000
```

Esto brinda flexibilidad al momento de desplegar o testear la aplicación en distintos entornos o puertos, sin necesidad de modificar archivos de configuración.

[Volver al menú](#top)

## 🧪 Funcionalidad de Mocking

Este sistema permite generar datos falsos para pruebas o poblar la base de datos en desarrollo.
[Volver al menú](#top)

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

[Volver al menú](#top)

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

[Volver al menú](#top)

---

<a name="endpoint-apimocksgeneratedata"></a>

### 📍 Endpoint `/api/mocks/generateData`

**Método:** `POST`

**Ruta:** `/api/mocks/generateData`

**Parámetros (por body):**

```json
{
	"users": 10,
	"pets": 20
}
```

**Descripción:** Inserta directamente en la base de datos la cantidad de usuarios y mascotas especificados por body.

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

[Volver al menú](#top)

---

<a name="erroresinesperados"></a>

### 🛑 Manejo de Errores Inesperados

La aplicación implementa un **sistema de captura, registro y respuesta** ante **errores no controlados** que puedan surgir en tiempo de ejecución.

Cuando ocurre un error inesperado en el servidor:

| Componente                      | Descripción                                                                                                                                                                   |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📋 **Registro de error**        | Se crea automáticamente un archivo `.log` en la carpeta `logs/` dentro del proyecto. Cada día se genera un archivo nuevo con la fecha como nombre (`YYYY-MM-DD.log`).         |
| 🗂️ **Formato del log**          | Cada error registrado contiene:<br>• `timestamp`: fecha y hora exacta<br>• `message`: mensaje del error<br>• `stack`: traza de pila completa del error para diagnóstico       |
| 📂 **Gestión de carpeta logs/** | Si la carpeta `logs/` no existe, se crea automáticamente.                                                                                                                     |
| 📡 **Respuesta al cliente**     | El servidor responde con un `status 500` y un mensaje estándar: <br> `"Unexpected server error - Try later or contact your administrator"`, sin exponer información sensible. |

---

#### 📜 Ejemplo de un error registrado:

```json
[
	{
		"timestamp": "2025-04-28T19:45:31.920Z",
		"message": "Cannot read properties of undefined (reading 'cart')",
		"stack": "TypeError: Cannot read properties of undefined (reading 'cart')\n    at ..."
	}
]
```

🚨 **Beneficios de esta estrategia**

- Protección de la aplicación: el usuario nunca ve detalles sensibles del error.
- Facilita la depuración: el desarrollador accede a logs completos para analizar.
- Escalabilidad: permite integrar fácilmente herramientas como Winston, Sentry, etc.
- Automatización: la creación de carpetas y archivos de log es automática.

[Volver al menú](#top)

---
<a name="postman"></a>

### ![Postman Icon](https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/000000/external-postman-is-the-only-complete-api-development-environment-logo-color-tal-revivo.png) Postman Collection 

En el repositorio podrás encontrar la colección de Postman para facilitar la prueba de los endpoints de la API.  
Puedes importar esta colección en Postman y realizar todas las operaciones disponibles, incluyendo las rutas de usuarios, mascotas y mockeo de datos.

➡️ [Ver colección AdoptMe (archivo JSON)](https://raw.githubusercontent.com/hmfarias/adoptme/main/AdoptMe.postman_collection.json)

📥 **Para descargar:**  
Haz clic derecho en el enlace anterior y elige **"Guardar enlace como..."** o presiona `Ctrl + S` en el navegador.


[Volver al menú](#top)

---

## 📫 Contacto

¿Dudas o sugerencias? No dudes en abrir un issue o contactarme directamente.

[Volver al menú](#top)
