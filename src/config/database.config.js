import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
	try {
		await mongoose.connect(config.MONGODB_URI, {
			dbName: config.DB_NAME,
		});
		console.log(`DB online`);
	} catch (error) {
		console.log('Error connecting with the database:', error);
	}
};
