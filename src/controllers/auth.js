const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const isEmail = require("../utils/isEmail");
const mysql = require("../db/mysql");

const authToken = (req, res) => {
  const {
    body: { email, password },
  } = req;
  if (!email || !password) {
    throw new BadRequestError("Please provide email, name, password, confirm");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("email is invalid");
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

module.exports = { authToken };
