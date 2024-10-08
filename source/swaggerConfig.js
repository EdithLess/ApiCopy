const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API doc",
      version: "1.0",
      description: "this is a simple API documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spacs = swaggerJsDoc(options);

module.exports = spacs;
