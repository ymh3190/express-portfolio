const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const mysql = require("./db/mysql");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/products">products route</a>');
});
app.use("/products", productsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
mysql.connect((err) => {
  if (err) throw err;
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
});
