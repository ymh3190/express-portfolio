const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try argain later",
  };

  if (err.code && err.errno === 1062) {
    customError.msg = `${err.sqlMessage}, please choose another value`;
    customError.statusCode = 400;
  }
  res
    .status(customError.statusCode)
    .render("pages/error", { msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
