const mysql = require("../db/mysql");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors/index");
const isEmail = require("../utils/isEmail");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { login, dashboard };
