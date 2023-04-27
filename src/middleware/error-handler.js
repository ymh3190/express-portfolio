import { StatusCodes } from "http-status-codes";

/**
 * app.use()를 통해 모든 route에 대해 적용되며 에러를 처리하는 미들웨어
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try argain later",
  };
  if (err.code && err.errno === 1062) {
    customError.msg = `${err.sqlMessage}, please choose another value`;
    customError.statusCode = err.errno;
  }
  if (err.code && err.errno === 1251) {
    customError.msg = `${err.sqlMessage}, disconnected to db`;
    customError.statusCode = err.errno;
  }
  res.status(customError.statusCode).render("pages/error", {
    msg: customError.msg,
    siteTitle: "Express-Portfolio",
  });
};

export default errorHandlerMiddleware;
