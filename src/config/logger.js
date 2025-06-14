import winston from 'winston';
import { config } from '../config/config.js';
import __dirname from '../utils.js';
import path from 'path';

const logDir = path.join(__dirname, 'logs');
const errorLogPath = path.join(logDir, 'errors.log');

// Levels
const customLevels = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		debug: 'blue',
		http: 'magenta',
		info: 'green',
		warning: 'yellow',
		error: 'red',
		fatal: 'red bold',
	},
};
winston.addColors(customLevels.colors);

// Loger for development
const devLogger = winston.createLogger({
	levels: customLevels.levels,
	level: 'debug',
	format: winston.format.combine(
		winston.format.colorize({ all: true }),
		winston.format.simple()
	),
	transports: [
		new winston.transports.Console({
			level: 'debug', // Muy importante
			handleExceptions: true,
		}),
	],
});

// Logger for production
const prodLogger = winston.createLogger({
	levels: customLevels.levels,
	level: 'info',
	format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	transports: [
		new winston.transports.Console({
			level: 'info',
			handleExceptions: true,
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.simple()
			),
		}),
		new winston.transports.File({
			filename: errorLogPath,
			level: 'error',
			handleExceptions: true,
		}),
	],
});

const env = config.NODE_ENV || 'development';
export const logger = env === 'production' ? prodLogger : devLogger;

// Middleware to add the logger to req
export const addLogger = (req, res, next) => {
	console.log('Logger middleware running in:', env);
	req.logger = logger;
	req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`);
	next();
};

// Global error handling ---------------
// error without try/catch
process.on('uncaughtException', (err) => {
	logger.fatal(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
	setTimeout(() => process.exit(1), 200);
});
// Rejections promises not handled
process.on('unhandledRejection', (reason, promise) => {
	logger.fatal(`UNHANDLED REJECTION: ${reason}`, { stack: reason?.stack });
});
//--------------------------------------
