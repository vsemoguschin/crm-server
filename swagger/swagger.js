
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
	info: {
		// API informations (required)
		title: 'Easy CRM', // Title (required)
		version: '1.0.0', // Version (required)
		description: 'Описание методов для Easy CRM', // Description (optional)
		path: 'http:localhost:5000',
	},
};

const options = {
	// Import swaggerDefinitions
	swaggerDefinition,
	explorer: true,
	// Path to the API docs
	// Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
	apis: ['./routes/*.js'],
};

const router = require("../routes");

const swaggerDocument = swaggerJsdoc(options)

module.exports = function (app) {
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	app.use('/api', router);
}