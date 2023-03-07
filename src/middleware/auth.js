const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const mysql = require("../dbs/mysql");
const { UnauthenticatedError, NotFoundError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;

  const authHeader = authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;
    mysql.query(
      "SELECT name FROM users WHERE id=? AND email=?",
      [id, email],
      (err, results) => {
        if (err) throw err;
        const user = results[0];
        if (!user) throw new NotFoundError("user not found");
        const { name } = user;
        req.user = { id, email, name };
        next();
      }
    );
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticationMiddleware;
