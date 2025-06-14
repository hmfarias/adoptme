import express from 'express';
import { connectDB } from './config/database.config.js';
import { config } from './config/config.js';

import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

// mocks router
import mocksRouter from './routes/mocks.router.js';

// logger router
import loggerRouter from './routes/logger.router.js';

// logger
import { addLogger, logger } from './config/logger.js';

// swagger
import { swaggerSpecs, swaggerUiExpress } from './config/swagger.js';

// app initialization
const app = express();

// app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addLogger); // logger

// routes
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api', loggerRouter);

//swagger
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

// For routes not found
app.use((req, res) => {
	req.logger.warning(`Invalid route: ${req.method} ${req.originalUrl}`);
	res.status(404).json({ error: true, message: 'Route not found' });
});

// start the server
try {
	//connect to the database
	await connectDB();
	app.listen(config.PORT, () => {
		logger.info(
			`Server is running on port ${config.PORT} - DB: ${config.DB_NAME} - ENV: ${config.NODE_ENV}`
		);
	});
} catch (error) {
	logger.fatal(`Fatal error during startup: ${error.message}`, { stack: error.stack });
	process.exit(1);
}

app.use((err, req, res, next) => {
	req.logger?.error(`Global Express error handler: ${err.message}`, { stack: err.stack });
	res.status(500).send({ status: 'error', message: 'Internal server error' });
});
