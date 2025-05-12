// Import dotenv and initialize environment variables
import dotenv from 'dotenv';
import { Command } from 'commander';
import __dirname from '../utils.js';
import path from 'path';

// Use __dirname to be shure that the path is correct independently of the level from which the app is called
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true }); // Load the .env file

// Initialize Commander
const program = new Command();

program
	.option('-p, --port <port>', 'Set the server port') // Optional command-line argument
	.parse(process.argv);

// Get the CLI options
const options = program.opts();

// Fallback priority: CLI > .env > 3000
export const config = {
	PORT: options.port || process.env.PORT || 8080,
	DB_NAME: process.env.DB_NAME,
	MONGODB_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`,
	SECRET_KEY: process.env.SECRET_KEY,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
