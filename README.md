# 🐾 AdoptMe Backend

Este proyecto es un backend para gestionar usuarios y mascotas, con funcionalidades avanzadas como mockeo de datos para testing y desarrollo.

---

## 📋 Menú

- [🔍 Revisión del Código](#revision-del-codigo)
  - [📚 Estandarización de nombres de archivo](#nombres-de-archivos)
  - [⚠️ Control de errores (try/catch)](#control-de-errores)
  - [📌 Métodos sin implementar](#metodos-sin-implementar)
- [🔐 CREDENCIALES - .env](#credenciales)
- [🔧 Instalación](#-instalación)
- ⚙️ [Configuración del Puerto y Entorno desde Línea de Comandos](#comander)
- [🧠 LOGGER Integrado con Winston](#logger)
- [🧪 Funcionalidad de MOCKING](#-funcionalidad-de-mocking)
  - [📍 Endpoint `/api/mocks/mockingusers`](#endpoint-apimocksmockingusers)
  - [📍 Endpoint `/api/mocks/mockingpets`](#endpoint-apimocksmockingpets)
  - [📍 Endpoint `/api/mocks/generateData`](#endpoint-apimocksgeneratedata)
- [📦 Utilidades](#-utilidades)
- 🛑 [Manejo de errores inesperados - LOG](#erroresinesperados)
- 📬 [Postman Collection para hacer las pruebas](#postman)

---

<a name="revision-del-codigo"></a>

## 🔍 Revisión del código

<a name="nombres-de-archivos"></a>

### 📚 Estandarización de nombres de archivos

Con el fin de adoptar una práctica uniforme, mantener la coherencia y evitar errores, se realizó una **normalización de los nombres de archivos y carpetas** en todo el proyecto.
Se aplicó una convención uniforme de nombres de archivos utilizando minúsculas separadas por puntos (user.model.js, adoption.repository.js, etc.), siguiendo las mejores prácticas de nomenclatura en proyectos Node.js. Esta convención facilita la organización por capas y el reconocimiento del propósito de cada archivo a través de su sufijo (.model, .dao, .service, .repository, etc.).

#### 🧭 Importancia de mantener un criterio uniforme

Mantener una convención uniforme en los nombres de archivos dentro de un proyecto es una **excelente práctica clave en el desarrollo de software**, por varias razones:

- ✅ Mejora la **legibilidad del código** y facilita la navegación del proyecto.
- ✅ Establece una **base coherente** para trabajar en equipo.
- ✅ Aumenta la **escalabilidad**, ya que se vuelve más fácil integrar nuevos módulos sin romper convenciones existentes.

#### 🔄 Cambios realizados

#### 📁 model/

- `Adoption.js` → `adoption.model.js`
- `Pet.js` → `pet.model.js`
- `User.js` → `user.model.js`

Y sus respectivas exportaciones internas pasaron a llamarse:

- `userModel` → `UserModel`
- `petModel`→ `PetModel`
- `adoptionModel` → `AdoptionModel`

#### 📁 dao/

- `Adoption.js` → `adoption.dao.js`
- `Pets.dao.js` → `pet.dao.js`
- `Users.dao.js` → `user.dao.js`

Clases exportadas: ( en algunos casos estaban en singular y otros en plural y no tenían un sufijo que haga referencia a la capa a la que pertenecen)

- `Adoption` →`AdoptionDAO`
- `Pet` → `PetDAO`
- `Users` → `UserDAO`

#### 📁 service/

- Se adaptaron las importaciones en base a los cambios de nombre realizados.

[Volver al menú](#top)

---

<a name="control-de-errores"></a>

### ⚠️ Manejo de errores (try/catch)

Aunque el código original del proyecto era funcional, carecía de protección ante errores inesperados (por ejemplo, problemas de conexión a la base de datos, errores al guardar, errores de formato de ID, etc.).
Atento a ell, mediante bloques try/catch se incorporó un manejo de errores consistente en los controladores adoptions, pets, sessions y users.
Esto permite:

- Capturar excepciones inesperadas.
- Devolver respuestas HTTP significativas al cliente.
- Evitar que el servidor se caiga por errores no controlados.
- Mantener una trazabilidad clara durante el desarrollo y debugging.

📌 Ejemplo de implementación en adoptions.controller.js:

El código original:

```js
const getAllAdoptions = async (req, res) => {
	const result = await adoptionsService.getAll();
	res.send({ status: 'success', payload: result });
};
```

El nuevo código:

```js
const getAdoption = async (req, res) => {
	try {
		const adoptionId = req.params.aid;
		const adoption = await adoptionsService.getBy({ _id: adoptionId });
		if (!adoption)
			return res.status(404).send({ status: 'error', error: 'Adoption not found' });
		res.send({ status: 'success', payload: adoption });
	} catch (error) {
		res.status(500).send({ status: 'error', error: error.message });
	}
};
```

[Volver al menú](#top)

---

<a name="metodos-sin-implementar"></a>

### 📌 Métodos sin implementar

El código original del proyecto no implementaba el metodo `deleteUser`. Este método se encuentra en el archivo `users.controller.js`.
Se ha añadido el método `deleteUser` en el archivo `users.controller.js` y se ha comentado el método original.

Método original:
Llama a getUserById, pero no hace ningún delete. El nombre del método implica que debería usar usersService.delete.

```js
const deleteUser = async (req, res) => {
	const userId = req.params.uid;
	const result = await usersService.getUserById(userId);
	res.send({ status: 'success', message: 'User deleted' });
};
```

Método implementado:

```js
const deleteUser = async (req, res) => {
	try {
		const userId = req.params.uid;
		const user = await usersService.getUserById(userId);
		if (!user) return res.status(404).send({ status: 'error', error: 'User not found' });

		await usersService.delete(userId);
		res.send({ status: 'success', message: 'User deleted' });
	} catch (error) {
		console.error('Error in deleteUser:', error);
		res.status(500).send({ status: 'error', error: 'Internal server error' });
	}
};
```

[Volver al menú](#top)

---

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
DB_NAME=backendIII
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

## ⚙️ Configuración del Puerto y del Entorno desde Línea de Comandos

La aplicación permite establecer de forma dinámica tanto el **puerto de ejecución** como el **modo (`development` o `production`)** a través de la línea de comandos, utilizando la librería [Commander](https://github.com/tj/commander.js).

Gracias a esta implementación, es posible ejecutar la aplicación con distintas configuraciones sin necesidad de modificar archivos.

### 🛠️ Prioridad de resolución para cada configuración

| Configuración | Prioridad de uso                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `PORT`        | 1. Línea de comandos `--port` o `-p`<br>2. Variable de entorno `.env`<br>3. Valor por defecto: `8080` |
| `NODE_ENV`    | 1. Línea de comandos `--mode`<br>2. Variable de entorno `.env`<br>3. Valor por defecto: `development` |

---

### 🧪 Ejemplos de uso

#### 🧩 Scripts configurados en package.json

```json
"scripts": {
	"start": "node src/app.js",
	"dev": "nodemon",
	"prod": "node src/app.js --mode production",
	"test": "mocha test/supertest.test.js"
}
```

#### Con npm scripts

```bash
npm run dev -> modo development en puerto 8080
npm run prod -> modo production en puerto 8080
```

O bien:

#### Puerto personalizado con entorno por defecto (development)

```bash
node src/app.js --port 4000
```

#### Entorno production con puerto por defecto (8080)

```bash
node src/app.js --mode production
```

#### Ambos definidos explícitamente

```bash
node src/app.js --port 5000 --mode production
```

#### Usando alias corto para el puerto

```bash
node src/app.js -p 5000 --mode development
```

### ✅ Resultado

✔ Flexibilidad total para definir entorno y puerto
✔ Ideal para entornos de desarrollo, testing o producción
✔ Compatible con .env y CLI
✔ El logger y otras funcionalidades sensibles al entorno se adaptan automáticamente.

[Volver al menú](#top)

---

<a name="logger"></a>

## 🧠 Logger Integrado con Winston

Esta aplicación utiliza un sistema de logging robusto implementado con [Winston](https://github.com/winstonjs/winston), que reemplaza completamente el uso de `console.log` y `console.error`, mejorando el monitoreo de errores y eventos tanto en desarrollo como en producción.

### 🧩 Objetivos del logger

- Estandarizar la salida de logs
- Registrar información relevante en consola y archivos `.log`
- Detectar y manejar errores críticos
- Permitir seguimiento por nivel de gravedad
- Escribir logs estructurados en producción
- Capturar errores no manejados

### 🛠️ Configuración de niveles personalizados

Se definieron los siguientes niveles de prioridad, de menor a mayor:

| Nivel     | Uso esperado                                    | Entorno          |
| --------- | ----------------------------------------------- | ---------------- |
| `debug`   | Detalles para desarrollo                        | ✅ Solo en DEV   |
| `http`    | Logs de solicitudes HTTP                        | ✅ Solo en DEV   |
| `info`    | Operaciones exitosas, mensajes generales        | ✅ DEV / ✅ PROD |
| `warning` | Comportamientos inesperados, sin bloquear       | ✅ DEV / ✅ PROD |
| `error`   | Fallos que permiten continuar la ejecución      | ✅ DEV / ✅ PROD |
| `fatal`   | Errores críticos que deben ser tratados urgente | ✅ DEV / ✅ PROD |

Colores personalizados para cada nivel están definidos usando `winston.addColors()`.

### 🌐 Entornos diferenciados

#### 🔧 Development

- Loggea a partir del nivel `debug`
- Solo en consola
- Salida colorizada y legible

#### 🚀 Production

- Loggea a partir del nivel `info`
- Consola y archivo `logs/errors.log` (solo a partir de `error`)
- Formato JSON estructurado

### 📂 Ruta del archivo de log

Los errores a partir del nivel `error` en producción son almacenados en:

```
/logs/errors.log
```

#### 🧪 Rutas de prueba

Se agregó una ruta de testing para simular logs de todos los niveles:

```http
GET /api/loggerTest
```

También se incluyeron pruebas para errores no capturados:

```
GET /api/loggerTest/fail    → Promesa rechazada sin catch
GET /api/loggerTest/boom    → Error lanzado sin try/catch
```

#### 🔥 Errores no manejados

El sistema también intercepta errores no capturados globalmente:

```
process.on('uncaughtException', (err) => { ... });
process.on('unhandledRejection', (reason, promise) => { ... });
```

Estos errores son logueados con nivel **fatal** y detallan el stack trace.

#### 🔁 Reemplazo completo de console.log y console.error

Todas las llamadas a console.log y console.error fueron reemplazadas por:

```js
req.logger.info(); // En lugar de console.log()
req.logger.error(); // En lugar de console.error()
req.logger.warning();
req.logger.fatal();
```

Esto garantiza un seguimiento coherente y profesional de eventos y errores.

#### 📈 Ejemplo de uso en controlador

```js
if (!user) {
	req.logger.warning(`User not found - ID: ${userId}`);
	return res.status(404).send({ error: true, message: 'User not found' });
}
```

#### ✅ Resultado

✔ Logs informativos y errores bien diferenciados
✔ Traza de errores críticos
✔ Captura global de fallos
✔ Mejora de mantenimiento y depuración

[Volver al menú](#top)

---

<a name="funcionalidad-de-mocking"></a>

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
