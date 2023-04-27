import { StatusCodes } from "http-status-codes";

/**
 * 로그인한 유저만 콜백함수를 호출
 */
const privateOnlyMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(StatusCodes.OK).redirect("/");
  }
};

export default privateOnlyMiddleware;
