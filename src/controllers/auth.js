const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const join = (req, res) => {
  const {
    body: { id, email },
  } = req;

  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.status(StatusCodes.OK).json({ token });
};

const login = (req, res) => {
  const {
    body: { id, email },
  } = req;

  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.status(StatusCodes.OK).json({ token });
};

module.exports = { join, login };
