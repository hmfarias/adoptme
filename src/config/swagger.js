import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { config } from './config.js';

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'AdoptMe API',
			description: 'ADOPTME API Documentation - User Management, Pets and Mocked Data.',
			version: '1.0.0',
		},
		servers: [
			{
				url: `http://localhost:${config.PORT}/api`,
				description: 'Local server',
			},
		],
	},
	apis: ['./src/docs/**/*.yaml'], // Archive routes with documentation
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export { swaggerUiExpress };
