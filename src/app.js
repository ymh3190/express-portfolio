require("dotenv").config();
const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const mainRouter = require("./routes/main");
const mysql = require("./db/mysql");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const localsMiddleware = require("./middleware/locals");

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(localsMiddleware);
app.use("/public", express.static("src/public"));

app.use("/", mainRouter);
app.use("/products", productsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
mysql.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
});
