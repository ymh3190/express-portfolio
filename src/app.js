require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("./db/mysql");
const localsMiddleware = require("./middleware/locals");
const mainRouter = require("./routes/main");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(express.json());

// middleware
app.use(localsMiddleware);

// static
app.use("/public", express.static("src/public"));

// routes
app.use("/", mainRouter);
app.use("/api/auth", authRouter);
app.use("/users", userRouter);

const port = process.env.PORT || 8000;

mysql.connect();
app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
