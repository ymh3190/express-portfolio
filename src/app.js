require("dotenv").config();
require("./db/mysql");
const { mysqlOptions } = require("./utils/mysqlOptions");

// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

// swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

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
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(xss());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MySQLStore(mysqlOptions),
  })
);
app.use(localsMiddleware);
app.use("/dist", express.static("dist"));

app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use("/", mainRouter);
app.use("/users", authenticationMiddleware, userRouter);
app.use("/videos", authenticationMiddleware, videoRouter);
app.use("/oauth", publicOnlyMiddleware, oauthRouter);
app.use("/history", authenticationMiddleware, historyRouter);

app.use(errorHandlerMiddleware);
app.use(notFound);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
