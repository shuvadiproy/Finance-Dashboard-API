const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/env');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description:
        'A robust RESTful API for a finance dashboard system with role-based access control (RBAC), financial records management, and analytics. Built with Node.js, Express, MongoDB, and JWT authentication.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from the login endpoint',
        },
      },
    },
  },
  apis: ['./src/app.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
