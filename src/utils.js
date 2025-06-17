import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import { fakerDE as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// Error handler
export const errorHandler = (error, res) => {
	const now = new Date();
	const today = now.toISOString().split('T')[0];
	const logPath = path.join(__dirname, 'logs', `${today}.log`);

	const logEntry = {
		timestamp: now.toISOString(),
		message: error.message,
		stack: error.stack,
	};

	// Ensure the logs directory exists
	fs.mkdirSync(path.dirname(logPath), { recursive: true });

	const logs = fs.existsSync(logPath)
		? JSON.parse(fs.readFileSync(logPath, 'utf-8') || '[]')
		: [];

	logs.push(logEntry);
	fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

	// Send the response
	res.status(500).json({
		error: true,
		message: 'Unexpected server error - Try later or contact your administrator',
		payload: null,
	});
};

// Generar mascota falsa
export const generateFakePet = () => {
	return {
		_id: new mongoose.Types.ObjectId(),
		name: faker.person.firstName(), // Reemplaza faker.animal.name() por esto
		specie: faker.helpers.arrayElement(['dog', 'cat', 'rabbit', 'bird']),
		birthDate: faker.date.past({ years: 10 }),
		adopted: false,
		image: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
	};
};

// Generar usuario falso
export const generateFakeUser = async () => {
	const hashedPassword = await bcrypt.hash('coder123', 10);
	return {
		_id: new mongoose.Types.ObjectId(),
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		password: hashedPassword,
		role: faker.helpers.arrayElement(['user', 'admin']),
		pets: [],
	};
};
