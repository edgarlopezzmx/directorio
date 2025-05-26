const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Directory API",
      version: "1.0.0",
      description: "Documentación de la API del directorio",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Juan Pérez",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@email.com",
            },
            password: {
              type: "string",
              example: "$2b$10$hash",
            },
          },
          required: ["id", "name", "email", "password"],
        },
        UserUpdate: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Nuevo Nombre",
            },
            email: {
              type: "string",
              format: "email",
              example: "nuevo@email.com",
            },
            password: {
              type: "string",
              example: "nuevacontraseña",
            },
          },
          required: [],
          description:
            "Todos los campos son opcionales, pero al menos uno debe enviarse para actualizar.",
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Mensaje de error",
            },
            details: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
          required: ["error"],
        },
        Contact:{
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Contacto Ejemplo",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@email.com",
            },
            phone: {
              type: "string",
              example: "5526104003",
            },
            userId: {
              type: "integer",
              example: 1,
            },
          },
          required: ["id", "name", "email", "phone", "userId"],
          description: "Esquema para un contacto en el directorio.",
        },
      },
    },
  },
  apis: ["./src/pages/api/**/*.ts"], // Ajusta la ruta si es necesario
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;