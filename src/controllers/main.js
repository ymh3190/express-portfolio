const mysql = require("../db/mysql");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const isEmail = require("../utils/isEmail");

const authToken = (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    throw new BadRequestError("!email || !password");
  }

  mysql.query("select * from users where email=?", email, (err, results) => {
    if (err) throw err;
    const { id } = results[0];
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    res.status(StatusCodes.OK).json({ token });
  });
};

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("login", { pageTitle: "Login" });
};

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

  const hash = await bcrypt.hash(password, 4);
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

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).render("index", { pageTitle: "Index" });
};

module.exports = {
  getIndex,
  getLogin,
  getJoin,
  postJoin,
  authToken,
};
