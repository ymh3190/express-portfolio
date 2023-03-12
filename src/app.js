require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const MySQLStore = require("express-mysql-session")(session);
const errorHandlerMiddleware = require("./middleware/error-handler");
require("./db/mysql");
const localsMiddleware = require("./middleware/locals");
const notFound = require("./middleware/notFound");
const mainRouter = require("./routes/main");
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos");

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
app.use("/dist", express.static("dist"));
app.use("/uploads", express.static("uploads"));

// routes
app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// error handler
app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
