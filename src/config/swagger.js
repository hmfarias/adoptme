import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { config } from './config.js';

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'AdoptMe API',
			version: '1.0.0',
			description: `
This API manages users, pets, adoptions, sessions, and mocking data.

---

### ⚠️ Invalid Routes (Catch-All)

Any request made to an **undefined or invalid route** will return a standard 404 response:

\`\`\`json
{
  "error": true,
  "message": "Route not found"
}
\`\`\`

Handled globally with:

\`\`\`js
app.use((req, res) => {
  req.logger.warning(\`Invalid route: \${req.method} \${req.originalUrl}\`);
  res.status(404).json({ error: true, message: 'Route not found' });
});
\`\`\`
`,
		},
		servers: [
			{
				url: `http://localhost:${config.PORT}`,
				description: 'Local server',
			},
		],
	},
	apis: ['./src/docs/**/*.yaml'], // Archive routes with documentation
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export { swaggerUiExpress };
