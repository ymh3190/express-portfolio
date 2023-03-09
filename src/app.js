require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const mysql = require("./db/mysql");
const errorHandlerMiddleware = require("./middleware/error-handler");
const MySQLStore = require("express-mysql-session")(session);
const localsMiddleware = require("./middleware/locals");
const notFound = require("./middleware/notFound");
const mainRouter = require("./routes/main");
const userRouter = require("./routes/users");

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    // development mode: secure false
    cookie: { secure: false },
    // store
    store: new MySQLStore({
      host: "localhost",
      user: "admin",
      password: "",
      database: "test",
    }),
  })
);

// middleware
app.use(localsMiddleware);

// static
app.use("/public", express.static("src/public"));

// routes
app.use("/", mainRouter);
app.use("/users", userRouter);

// error handler
app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 8000;

mysql.connect();
app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
