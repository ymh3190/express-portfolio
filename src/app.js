import "dotenv/config";
import "./db/mysql.js";
import { mysqlOptions } from "./utils/mysqlOptions.js";

// security
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";

// swagger
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

import express from "express";
import session from "express-session";
const app = express();

// session storage
import mySQLStore from "express-mysql-session";
const MySQLStore = mySQLStore(session);

// error handler
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFound from "./middleware/notFound.js";

// middleware
import localsMiddleware from "./middleware/locals.js";
import publicOnlyMiddleware from "./middleware/publicOnly.js";

// routers
import mainRouter from "./routes/main.js";
import userRouter from "./routes/users.js";
import videoRouter from "./routes/videos.js";
import oauthRouter from "./routes/oauth.js";
import historyRouter from "./routes/history.js";
import authenticationMiddleware from "./middleware/authentication.js";

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
    saveUninitialized: false,
    cookie: { secure: true },
    store: new MySQLStore(mysqlOptions),
  })
);
app.use(localsMiddleware);
app.use("/dist", express.static("dist"));
app.use("/favicon", express.static(process.cwd() + "/src/favicon"));

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
