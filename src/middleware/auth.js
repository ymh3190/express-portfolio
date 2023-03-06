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
      "select id,email,name from users where id=? and email=?",
      [id, email],
      (err, results) => {
        if (err) throw err;
        req.user = {
          id: results[0].id,
          email: results[0].email,
          name: results[0].name,
        };
        next();
      }
    );
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticationMiddleware;
