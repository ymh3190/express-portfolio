require("dotenv").config();
require("./db/mysql");

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const express = require("express");
const session = require("express-session");
const app = express();

// session storage
const MySQLStore = require("express-mysql-session")(session);

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/notFound");

// middleware
const localsMiddleware = require("./middleware/locals");
const publicOnlyMiddleware = require("./middleware/publicOnly");
const privateOnlyMiddleware = require("./middleware/privateOnly");

// routers
const mainRouter = require("./routes/main");
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos");
const oauthRouter = require("./routes/oauth");
const historyRouter = require("./routes/history");
const authenticationMiddleware = require("./middleware/authentication");

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
);
app.use(cors());
app.use(xss());
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
app.use("/videos", authenticationMiddleware, videoRouter);
app.use("/oauth", publicOnlyMiddleware, oauthRouter);
app.use("/history", privateOnlyMiddleware, historyRouter);

// error handler
app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
