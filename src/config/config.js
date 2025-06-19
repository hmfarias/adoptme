// Import dotenv and initialize environment variables
import dotenv from 'dotenv';
import { Command } from 'commander';
import __dirname from '../utils.js';
import path from 'path';

// If we are in test, we do not load cli options
const isTestEnv = process.env.NODE_ENV === 'test';

// Use __dirname to be shure that the path is correct independently of the level from which the app is called
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false }); // Load the .env file

// Initialize Commander
const program = new Command();

if (!isTestEnv) {
	program
		.option('-p, --port <port>', 'Set the server port')
		.option('--mode <mode>', 'Set the mode of the app (development or production)')
		.allowUnknownOption(true)
		.parse(process.argv);
}

// Get the CLI options
const options = program.opts();

// Si estamos en test, usar la base de datos de test
const DB_NAME = isTestEnv
	? process.env.DB_NAME_TEST || 'adoptme-test'
	: process.env.DB_NAME || 'adoptme';

// Fallback priority: CLI > .env > 3000
export const config = {
	PORT: options.port || process.env.PORT || 8080,
	DB_NAME,
	NODE_ENV: options.mode || process.env.NODE_ENV || 'development',
	MONGODB_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`,
	SECRET_KEY: process.env.SECRET_KEY,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
if (isTestEnv) {
	console.log('Running in mode:', config.NODE_ENV);
	console.log('Using port:', config.PORT);
	console.log('Using DB:', config.DB_NAME);
}
