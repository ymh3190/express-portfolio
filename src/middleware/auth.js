const jwt = require("jsonwebtoken");
const mysql = require("../db/mysql");
const { UnauthenticatedError } = require("../errors");

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
      "select * from users where id=? and email=?",
      [id, email],
      (err, results) => {
        if (err) throw err;
        req.user = results[0];
        next();
      }
    );
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticationMiddleware;
