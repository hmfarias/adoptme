# 🐾 AdoptMe Backend

<p align="center">
  <img src="https://github.com/hmfarias/adoptme/blob/main/src/public/img/banner.png" width="600"/>
</p>

---

<a name="menu"></a>

## [📋 Menú](#menu)

- [🐾 AdoptMe - Backend API para Gestión de Adopciones de Mascotas](#intro)
- [🔍 Revisión y corrección del Código](#revision-del-codigo)
  - [📚 Estandarización de nombres de archivo](#nombres-de-archivos)
  - [⚠️ Control de errores (try/catch)](#control-de-errores)
  - [📌 Métodos sin implementar](#metodos-sin-implementar)
  - [🧬 POPULATE](#populate)
    - [👤 Asociación entre Usuarios y Mascotas](#populate-userspets)
    - [😺 Asociación en adopciones](#populate-adoptions)
- [🔐 CREDENCIALES - .env](#credenciales)
- [🔧 Instalación](#-instalación)
- ⚙️ [Configuración del Puerto y Entorno desde Línea de Comandos](#comander)
- [🎭 MOCKING - Funcionalidad](#-funcionalidad-de-mocking)
- [🧠 LOGGER Integrado con Winston](#logger)
- [📘 SWAGGER - Documentación de la API](#swagger)
- [🧪 TESTING - Mocha y Supertest](#testing)
- [🐳 DOCKER - Instalación y ejecución](#docker)
- [🟠 Postman Collection para hacer las pruebas](#postman)
- [📞 Contacto](#contacto)

---

<a name="intro"></a>

## 🐾 AdoptMe - Backend API para Gestión de Adopciones de Mascotas

AdoptMe es una aplicación backend desarrollada con **Node.js**, **Express** y **MongoDB**, diseñada para gestionar un sistema completo de **adopción de mascotas**. Ofrece endpoints RESTful para la administración de usuarios, mascotas y adopciones, así como funcionalidades de autenticación, mocking de datos con `faker`, manejo de sesiones, testing, documentación con Swagger, y un sistema de logging profesional con Winston.

Este backend forma parte de una arquitectura en capas bien definida (`models`, `dao`, `repository`, `service`, `dto`, `controllers`, `routes`) que facilita la escalabilidad, el mantenimiento y la reutilización de código.

Incluye además:

- Carga de imágenes de mascotas con Multer 🐶
- Generación de usuarios y mascotas falsas con Faker 🧪
- Modo de ejecución configurable (`development` o `production`) ⚙️
- Logger centralizado con distintos niveles y archivo persistente de errores 📄
- Testeos automatizados con Supertest y Mocha 🧪
- Documentación Swagger accesible vía `/api/docs` 📘

Este repositorio está listo para desarrollo, testing, o despliegue en producción.

[Volver al menú](#menu)

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

[Volver al menú](#menu)

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
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};
```

[Volver al menú](#menu)

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
		res.status(500).json({
			error: true,
			message: 'Unexpected server error - Try later or contact your administrator',
			payload: null,
		});
	}
};
```

---

<a name="populate"></a>

### 🧬 POPULATE

<a name="populate-userspets"></a>

#### 👤 Asociación entre Usuarios y Mascotas

Se implementó una relación entre los usuarios y las mascotas adoptadas utilizando la funcionalidad de populate de Mongoose.

##### 📐 Modelo de Usuario (UserModel)

El campo pets del modelo de usuario fue definido como un array de referencias al modelo de mascotas (Pets), permitiendo almacenar múltiples IDs de mascotas adoptadas por un usuario:

```js
pets: [
	{
		_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Pets',
		},
	},
];
```

##### 🔍 Implementación de populate

Se actualizó la capa DAO (UserDAO) para incluir el método .populate('pets') en todas las consultas que recuperan usuarios. Esto permite que, al obtener un usuario, se devuelvan automáticamente los detalles completos de las mascotas asociadas, en lugar de solo sus IDs.

---

<a name="populate-adoptions"></a>

#### 😺 Asociación en adopciones

Para facilitar la obtención de información completa sobre cada adopción, se implementó populate automático en el modelo AdoptionModel. Esto permite que, al realizar cualquier consulta sobre adopciones (find, findOne, findById, etc.), los campos relacionados owner (usuario que adoptó) y pet (mascota adoptada) sean automáticamente poblados con sus datos correspondientes desde las colecciones Users y Pets.

##### 🔧 Implementación técnica:

Se utilizó un middleware pre(/^find/) en el schema de Mongoose:

```js
schema.pre(/^find/, function (next) {
	this.populate({
		path: 'owner',
		select: 'first_name last_name email role',
	}).populate({
		path: 'pet',
		select: 'name specie birthDate adopted',
	});
	next();
});
```

---

##### ✅ Beneficios de Populate

Con estas mejoras:
• Se facilita la visualización y consumo de los datos desde el cliente.
• Se evita realizar múltiples consultas para obtener los datos completos de las mascotas adoptadas por un usuario.

Esta asociación es esencial para representar de forma efectiva las relaciones en un sistema de adopciones, y es compatible con el diseño RESTful y la documentación Swagger generada para la API.

[Volver al menú](#menu)

---

<a name="credenciales"></a>

## 🔐 CREDENCIALES (archivo .env)

Antes de ejecutar la aplicación, es necesario crear un archivo .env en la carpeta raíz (donde se encuentra el package.json). Este archivo almacenará las variables de entorno necesarias para la configuración del servidor y la conexión a la base de datos. CON FINES DIDÁCTICOS SE DETALLA SU CONTENIDO PARA PODER PROBAR LA APLICACIÓN.

### 🟢 Contenido que debe tener el archivo .env:

```
PORT=8080
NODE_ENV=development

SECRET_KEY="X9v$3jK@pLm7!zQwT2"

DB_USER=hmfarias
DB_PASSWORD=QQATDs4SdAAWYa23
DB_HOST=cluster0.fergg.mongodb.net
APP_NAME=Cluster0
DB_NAME=adoptme

DB_NAME_TEST=adoptme-test

```

Este archivo a su vez es procesado por `/src/config/config.js`, que es el módulo que finalmente se encarga de cargar las variables de entorno y configurar los valores necesarios para el funcionamiento de la aplicación, como el puerto del servidor y la conexión a la base de datos.

[Volver al menú](#menu)

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
   Se pueden ejecutar los scripts de npm para iniciar la aplicación en modo desarrollo, producción o para correr todos los tests:

   ```bash
   npm run dev // modo desarrrollo
   ```

   ```bash
   npm run prod // modo producción
   ```

   ```bash
   npm run test // para correr todos los tests
   ```

   ```bash
   npm run test:unit // para correr test unitarios
   ```

   ```bash
   npm run test:integ // para correr test de integración
   ```

   Esto iniciará el servidor y mostrará un mensaje en la consola indicando que la aplicación está corriendo, informará el puerto y la base de datos.

✅ ¡Listo! Ya puedes explorar y probar la aplicación en tu entorno local. 🚀

[Volver al menú](#menu)

---

<a name="comander"></a>

## ⚙️ Configuración del Puerto y del Entorno desde Línea de Comandos

La aplicación permite establecer de forma dinámica tanto el **puerto de ejecución** como el **modo (`development` o `production`)** a través de la línea de comandos, utilizando la librería [Commander](https://github.com/tj/commander.js).

El modo de ejecucion `test` se configura al iniciar la aplicacion con `npm run test, npm run test:integ o npm run test:unit`, y las diferencias con los otros modos consisten en que No se registran logs, el puerto es `8080` y la base de datos es `adoptme-test`.

Gracias a esta implementación, es posible ejecutar la aplicación con distintas configuraciones sin necesidad de modificar archivos.

Luego de poner a correr la aplicación, se podrá ver la siguiente información en la consola de comandos para confirmar que el servidor está corriendo en el puerto y con la configuración deseada:

```
info: Server is running on port [PUERTO] - DB: backendIII - ENV: [MODO DE EJECUCIÓN].
```

Ejemplo:

```
info: Server is running on port 8080 - DB: backendIII - ENV: development
```

### 🛠️ Prioridad de resolución para cada configuración

| Configuración | Prioridad de uso                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `PORT`        | 1. Línea de comandos `--port` o `-p`<br>2. Variable de entorno `.env`<br>3. Valor por defecto: `8080` |
| `NODE_ENV`    | 1. Línea de comandos `--mode`<br>2. Variable de entorno `.env`<br>3. Valor por defecto: `development` |

**Nota:** El modo de ejecución `test` no se asigna por linea de comando sino directamente al iniciar la aplicacion con `npm run test`, `npm run test:integ` o `npm run test:unit`.

---

### 🧪 Ejemplos de uso

#### 🧩 Scripts configurados en package.json

```json
"scripts": {
	"start": "node src/app.js",
	"dev": "nodemon",
	"prod": "node src/app.js --mode production",
	"test:unit": "NODE_ENV=test mocha test/unit/", //test unitarios
	"test:integ": "NODE_ENV=test mocha test/integration/", //test de integración
	"test": "NODE_ENV=test mocha \"test/**/*.test.js\"" //corre todos los tests
	},
```

#### Con npm scripts

```bash
npm run dev -> modo development en puerto 8080 - Base de datos: adoptme
npm run prod -> modo production en puerto 8080 - Base de datos: adoptme
npm run test -> corre todos los tests - modo test en puerto 8080 - Base de datos: adoptme-test
npm run test:unit -> corre los tests unitarios solamente - modo test en puerto 8080 - Base de datos: adoptme-test
npm run test:integ -> corre los test de integración solamente - modo test en puerto 8080 - Base de datos: adoptme-test
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

[Volver al menú](#menu)

---

<a name="funcionalidad-de-mocking"></a>

## 🎭 Funcionalidad de Mocking

Este sistema permite generar datos falsos para pruebas o poblar la base de datos.

### 📍 Endpoint `/api/mocks/mockingusers/:quantity`

**Método:** `GET`

**Descripción:** Genera usuarios falsos (no los inserta en la BD) de acuerdo a la cantidad recibida por query param "quantity", con las siguientes características:

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

### 📍 Endpoint `/api/mocks/mockingpets?quantity=1`

**Método:** `GET`

**Descripción:** Genera mascotas falsas (no las inserta en la BD) de acuerdo a la cantidad recibida por query param "quantity", con las siguientes características:

- Sin `owner`.
- `adopted`: en falso.

**Ejemplo de respuesta:**

```json
{
	"error": false,
	"message": "mocking pets",
	"payload": [
		{
			"_id": "6853548b4e90d9956461aa0b",
			"name": "Annabel",
			"specie": "rabbit",
			"birthDate": "2018-12-12T00:57:21.808Z",
			"adopted": false,
			"image": "https://picsum.photos/seed/i1E8MB/400/400?blur=6"
		}
	]
}
```

### 📍 Endpoint `/api/mocks/generateData`

**Método:** `POST`

**Descripción:** Recibe por body el número de usuarios y mascotas a crear y las inserta en la base de datos.

**Ejemplo de respuesta:**

```json
{
    "error": false,
    "message": "Generated 5 users and 10 pets",
    "payload": {
        "insertedUsers": [
            {
                "first_name": "Larissa",
                "last_name": "Jagusch",
                "email": "Natalie_Dreissigacker22@hotmail.com",
                "password": "$2b$10$ZC7BbNIaHrcwN/zY0S2sPuLdlFE8TA9TUBzSC.gkkF83HbU34lR8i",
                "role": "user",
                "pets": [],
                "_id": "685347febb981162833fed00",
                "__v": 0
            },
			...
        ],
        "insertedPets": [
            {
                "name": "Annabel",
                "specie": "rabbit",
                "birthDate": "2018-12-12T00:57:21.808Z",
                "adopted": false,
                "image": "https://picsum.photos/seed/i1E8MB/400/400?blur=6",
                "_id": "6853548b4e90d9956461aa0b",
                "__v": 0
            },
			...
        ]
    }
}
```

[Volver al menú](#menu)

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

**Nota:** **La ejecucion de la aplicacion en modo `test` no generará logs.**

### 🌐 Entornos diferenciados

#### 🔧 Development

- Loggea a partir del nivel `debug`
- Solo en consola
- Salida colorizada y legible

#### 🚀 Production

- Loggea a partir del nivel `info`
- Consola y archivo `logs/errors.log` (solo a partir de `error`)
- Formato JSON estructurado

#### 🧪 Test

- NO LOGUEA

### 📂 Ruta del archivo de log

Los errores a partir del nivel `error` en producción son almacenados en:

```
/logs/errors.log
```

### 🧪 Rutas de prueba

Se agregaron rutas de testing para simular logs de todos los niveles:

```http
GET /api/loggerTest
```

También se incluyeron pruebas para errores no capturados:

```
GET /api/loggerTest/fail    → Promesa rechazada sin catch
GET /api/loggerTest/boom    → Error lanzado sin try/catch
```

**Todas estas rutas puedes probarlas en la coleccion Postman que se adjunta en el repositorio.** (Ver la sección [Postman](#postman) ).

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

[Volver al menú](#menu)

---

<a name="swagger"></a>

## 📘 Swagger - Documentación de la API

La API cuenta con documentación interactiva generada con Swagger (OpenAPI 3.0). Esta documentación incluye detalles completos de cada recurso: users, pets, adoptions, sessions, mocks, entre otros.

#### ✅ Características destacadas:

- Documentación dividida por módulos en archivos YAML (users.yaml, pets.yaml, sessions.yaml, etc.)
- Esquemas reutilizables definidos en components.yaml (errores comunes, respuestas genéricas)
- Manejo de errores bien tipificados (400, 404, 422, 500, etc.)
- Generación de datos falsos para pruebas desde endpoints /mockingusers, /mockingpets, /generateData

#### 📍 Acceso

Una vez que la app está en ejecución, se accede a la documentación de la API a través de la siguiente URL:

```
http://localhost:[PORT]/api/docs
```

Se debe remplazar `[PORT]` con el número de puerto en el que se está ejecutando la aplicación.

[Volver al menú](#menu)

---

<a name="testing"></a>

## 🧪 TESTING - Mocha y Supertest

Este proyecto implementa una arquitectura de testing profesional que distingue entre tests unitarios y tests de integración, ejecutándolos en un entorno aislado para garantizar la consistencia y evitar conflictos con los datos reales.

#### 🔧 Modo Test

Cuando se ejecutan los tests, la aplicación se configura automáticamente en modo test mediante la variable de entorno NODE_ENV=test. Esto activa comportamientos especiales definidos en el código, como:

- Uso de una base de datos exclusiva para pruebas (**adoptme-test**), evitando afectar los datos reales de desarrollo o producción.
- **Desactivación del logger**, para evitar contaminación visual innecesaria durante las pruebas.

Esto se controla desde el archivo config.js, que evalúa process.env.NODE_ENV para determinar si el entorno activo es de test y ajustar configuraciones internas.

#### 📂 Estructura de Tests

Los tests están organizados en carpetas separadas:

test/
├── unit/ --> Tests unitarios (users, pets, adoptions, utils, DAOs, DTOs, etc.)
├── integration/ --> Tests de integración (rutas, controladores, flujos completos)

#### 🧪 Comandos

Para ejecutar los tests, se definen scripts separados en package.json:

```json
"scripts": {
  "test:unit": "NODE_ENV=test mocha test/unit/", //test unitarios
  "test:integ": "NODE_ENV=test mocha test/integration/" //test de integración
  "test": "NODE_ENV=test mocha \"test/**/*.test.js\"" //corre todos los tests
}
```

**Para ejecutar los tests:**

```bash
npm run test:unit     # Ejecuta sólo tests unitarios
```

```bash
npm run test:integ    # Ejecuta sólo tests de integración
```

```bash
npm run test          # Ejecuta todos los tests
```

> #### ‼️ CONSIDERACION IMPORTANTE - Tests de integración
>
> **Los tests de integración `"npm run test:integ"`, ⚠️ NO REQUIEREN QUE SE LEVANTE LA APLICACION EN PARALLELO**⚠️.
> La aplicación ha sido diseñada para que los tests de integración utilicen directamente la instancia de la app (app.js) sin iniciar el servidor (app.listen(...)). y permite que herramientas como Supertest interactúen con la aplicación de manera controlada y aislada.

---

<a name="docker"></a>

## 🐳 DOCKER - Instalación y ejecución

Esta aplicación puede ejecutarse fácilmente en un contenedor usando Docker.

### 🖼️ Imagenes Docker

📦 Las imagenes están publicadas en Docker Hub:

> 👉 Modo desarrollo: [hmfarias/adoptme-app](https://hub.docker.com/r/hmfarias/adoptme-app)

> 👉 Modo producción: [hmfarias/adoptme-app-prod](https://hub.docker.com/r/hmfarias/adoptme-app-prod)

### ⤵️ Descarga de las imágenes

Ejecutá uno de los siguientes comandos (o ambos si lo deseas):

Para modo desarrollo:

```bash
docker pull hmfarias/adoptme-app
```

o bien para la versión de producción:

```bash
docker pull hmfarias/adoptme-app-prod
```

### 🚀 Ejecución de la aplicación

#### 1- ⚙️ Requisitos previos

- Tener [Docker instalado](https://docs.docker.com/get-docker/)
- Tener un archivo `.env` con tu configuración

  🔐 Ver detalles en la sección [CREDENCIALES (.env)](#credenciales)

#### 2- 🚀 Ejecutar el contenedor

Ubicado en la misma carpeta donde se encuentra el archivo`.env`, puedes ejecutar los siguientes comandos:

Modo desarrollo:

```bash
docker run --name adoptme-app -p 8080:8080 --env-file .env hmfarias/adoptme-app
```

Modo producción:

```bash
docker run --name adoptme-app -p 8080:8080 --env-file .env hmfarias/adoptme-app-prod
```

📌 Este comando:

- Inicia la aplicación en el puerto 8080.
- Carga tus variables de entorno desde el archivo `.env`.
- Ejecuta automáticamente la aplicación.

A partir de ahora, puedes acceder a la aplicación en tu navegador a través del puerto 8080 y visitar por ejemplo la documentacion de la API:

```
http://localhost:8080/api/docs
```

O bien, usar la colección de **Postman** incluida en este repositorio, 👉 Ver sección 🧪 [Postman](#postman) para más información.

#### 3- 🛑 Detener el contenedor y liberar el puerto:

Puedes presionar `Ctrl + C` tres veces en la terminal donde se está ejecutando el contenedor, o bien, abrir otra terminal.

Luego ejecuta el siguiente comando:

```bash
docker rm -f adoptme-app
```

---

### 🧪 Para correr tests

No hay una imagen Docker para correr los tests.
Las imágenes están pensadas para desarrollo o producción.
Si querés ejecutar los tests (unitarios o de integración), deberás clonar el repositorio y usar los scripts de package.json.
🔧 Ver sección 📥 [Instalacion local](#instalacionlocal)

Luego usá los comandos:

```bash
npm run test
npm run test:unit
npm run test:integ
```

👉 Más detalles en la sección 🧪 [TESTING - Mocha y Supertest](#testing)

---

<a name="postman"></a>

## ![Postman Icon](https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/000000/external-postman-is-the-only-complete-api-development-environment-logo-color-tal-revivo.png) Postman Collection

En el repositorio podrás encontrar la colección de Postman para facilitar la prueba de los endpoints de la API.  
Puedes importar esta colección en Postman y realizar todas las operaciones disponibles, incluyendo las rutas de usuarios, mascotas y mockeo de datos.

➡️ [Ver colección AdoptMe (archivo JSON)](https://raw.githubusercontent.com/hmfarias/adoptme/main/AdoptMe.postman_collection.json)

📥 **Para descargar:**  
Haz clic derecho en el enlace anterior y elige **"Guardar enlace como..."** o presiona `Ctrl + S` en el navegador.

[Volver al menú](#menu)

---

<a name="contacto"></a>

## 📫 Contacto

**Marcelo Farias**  
📱 +54 9 351 260 1888  
📧 hmfarias7@gmail.com  
💼 [LinkedIn - Marcelo Farias](https://www.linkedin.com/in/hugo-marcelo-farias/)

¿Dudas o sugerencias? No dudes en abrir un issue o contactarme directamente.

[Volver al menú](#menu)
