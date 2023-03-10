const { UnauthorizedError } = require("../errors");

const authenticationMiddleware = (req, res, next) => {
  if (!req.session.user) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

module.exports = authenticationMiddleware;
