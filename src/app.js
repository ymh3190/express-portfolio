require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
require("./db/mongo");
const mysql = require("./db/mysql");

const localsMiddleware = require("./middleware/locals");
const productsRouter = require("./routes/products");
const mainRouter = require("./routes/main");
const authRouter = require("./routes/auth");

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     window: 15 * 60 * 1000,
//     max: 100,
//   })
// );
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(localsMiddleware);
app.use("/public", express.static("src/public"));

app.use("/", mainRouter);
app.use("/api/auth", authRouter);
app.use("/products", productsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;
mysql.connect((err) => {
  if (err) throw err;
  console.log("Connected to mysql");
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
});
