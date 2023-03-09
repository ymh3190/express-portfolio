const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .render("pages/error", { msg: err.message });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .render("pages/error", { msg: err.message });
};

module.exports = errorHandlerMiddleware;
