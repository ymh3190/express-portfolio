const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  // mysql에서 validation 판단 안함
  // const customError = {
  //   statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  //   msg: err.message || "Something went wrong try argain later",
  // };
  // if (err.code && err.errno === 1062) {
  //   customError.msg = `${err.sqlMessage}, please choose another value`;
  //   customError.statusCode = 400;
  // }
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
