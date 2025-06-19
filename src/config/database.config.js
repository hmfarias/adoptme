import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from './logger.js';

export const connectDB = async (db_Name) => {
	try {
		await mongoose.connect(config.MONGODB_URI, {
			dbName: db_Name,
		});
		logger.info(`DB online → ${db_Name}`);
	} catch (error) {
		logger.fatal(`Error connecting with the database: ${error.message}`, {
			stack: error.stack,
		});
	}
};
