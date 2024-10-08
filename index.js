require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const express = require("express");

const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const homeRouter = require("./routes/homepage");
const loginRouter = require("./routes/login");

const swaggerSpec = require("./source/swaggerConfig");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(productsRouter);
app.use(categoriesRouter);
app.use(loginRouter);
app.use(homeRouter);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
