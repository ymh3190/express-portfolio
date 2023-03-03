const jwt = require("jsonwebtoken");
const mysql = require("../db/mysql");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const isEmail = require("../utils/isEmail");

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).render("join", { pageTitle: "Join" });
};

const postJoin = async (req, res) => {
  const {
    body: { email, name, password, confirm },
  } = req;
  if (!email || !name || !password || !confirm) {
    throw new BadRequestError("Please provide email, name, password, confirm");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("email is invalid");
  }
  if (password !== confirm) {
    throw new BadRequestError("password is incorrect");
  }

  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  let sql = "INSERT INTO `users`(email, name, password) VALUES(?, ?, ?)";
  mysql.query(sql, [email, name, hash], (err, results) => {
    if (err) throw err;
    sql = "SELECT * FROM `users` WHERE `email` = ?";
    mysql.query(sql, email, (err, results) => {
      if (err) throw err;
      const user = results[0];
      req.user = user;
      res.status(StatusCodes.CREATED).redirect("/");
    });
  });
};

const getLogin = (req, res) => {
  const { user } = req;
  if (user) {
    return res.status(StatusCodes.OK).end();
  }
  res.status(StatusCodes.OK).render("login", { pageTitle: "Login" });
};

const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("email is invalid");
  }

  try {
    const url = `http://localhost:${process.env.PORT}/api/auth`;
    const data = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { token } = await data.json();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { id } = await response.json();
    mysql.query("SELECT * FROM `users` WHERE `id` = ?", id, (err, results) => {
      if (err) throw err;
      req.headers.authorization = `Bearer ${token}`;
      res.status(StatusCodes.OK).redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

const authLogin = (req, res) => {
  const {
    headers: { authorization },
  } = req;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Unauthenticated Error");
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    res.status(StatusCodes.OK).json({ id });
  } catch (err) {
    throw new UnauthenticatedError("jwt verify error");
  }
};

const authToken = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  mysql.query(sql, email, async (err, results) => {
    if (err) throw err;
    const isCorrect = await bcrypt.compare(password, results[0].password);
    if (!isCorrect) throw new BadRequestError("Password is Incorrect");
    if (results.length === 0) throw new NotFoundError("Results does not exist");
    const { id } = results[0];
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET);
    res.status(StatusCodes.OK).json({ token });
  });
};

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).render("index", { pageTitle: "Index" });
};

module.exports = {
  getIndex,
  getLogin,
  authToken,
  authLogin,
  postLogin,
  getJoin,
  postJoin,
};
