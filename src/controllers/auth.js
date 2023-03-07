const mysql = require("../dbs/mysql");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../errors/index");
const isEmail = require("../utils/isEmail");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const join = async (req, res) => {
  const {
    body: { email, name, password, confirm },
  } = req;

  if (!email || !name || !password || !confirm) {
    throw new BadRequestError("provide email, name, password and confirm");
  }
  if (password !== confirm) {
    throw new BadRequestError("confirm password is incorrect");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email is invalid");
  }
  const hash = await bcrypt.hash(password, 10);
  mysql.query(
    "INSERT INTO users(email, name, password) VALUES(?,?,?)",
    [email, name, hash],
    (err, results) => {
      if (err) throw err;
    }
  );
  mysql.query("SELECT * FROM users WHERE email=?", email, (err, results) => {
    if (err) throw err;
    const user = results[0];
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ errMsg: new NotFoundError("User not found") });
    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ user: { id, email, name: user.name }, token });
  });
};

const login = (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    throw new BadRequestError("provide email and password");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("email is invalid");
  }
  mysql.query("select id from users where email=?", email, (err, results) => {
    if (err) throw err;
    if (!results[0]) return res.status(StatusCodes.NOT_FOUND).end();
    const user = results[0];
    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    res.status(StatusCodes.OK).json({ token });
  });
};

const dashboard = (req, res) => {
  const { user } = req;
  res.status(StatusCodes.OK).json({ user });
};

module.exports = { join, login, dashboard };
