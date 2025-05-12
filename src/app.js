import express from 'express';
import { connectDB } from './config/database.config.js';
import { config } from './config/config.js';

import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

// app initialization
const app = express();

// app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

//connect to the database
await connectDB();

// start the server

app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT} - DB: ${config.DB_NAME}`);
});
