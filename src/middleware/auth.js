const { UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id, email } = decoded;
  req.user = { id, email };
  next();
};

module.exports = authenticationMiddleware;
