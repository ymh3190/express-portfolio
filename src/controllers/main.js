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

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("login", { pageTitle: "Login" });
};

const getJoin = (req, res) => {
  const {
    headers: { authorization },
  } = req;

  const authHeader = authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.OK).render("join", { pageTitle: "Join" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id, email } = decoded;
  mysql.query(
    "select * from users where id=? and email=?",
    [id, email],
    (err, results) => {
      if (err) throw err;
      req.user = {
        id: results[0].id,
        email: results[0].email,
        name: results[0].name,
      };
      res.status(StatusCodes.OK).json({ user: { id, email } });
    }
  );
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
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );
      res
        .status(StatusCodes.CREATED)
        .render("login", { pageTitle: "Login", user: req.user, token });
    });
  });
};

const getIndex = (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(StatusCodes.OK).render("index", { pageTitle: "Index" });
  }
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getIndex,
  getLogin,
  getJoin,
  postJoin,
};
