const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Swagger docs en http://localhost:${PORT}/api-docs`);
});