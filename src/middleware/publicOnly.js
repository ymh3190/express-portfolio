const { StatusCodes } = require("http-status-codes");

const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.user) {
    return res.status(StatusCodes.OK).redirect("/");
  } else {
    next();
  }
};

module.exports = publicOnlyMiddleware;
