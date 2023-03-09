const { UnauthorizedError } = require("../errors");

const authenticationMiddleware = (req, res, next) => {
  const { session } = req;
  if (!session.user) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

module.exports = authenticationMiddleware;
