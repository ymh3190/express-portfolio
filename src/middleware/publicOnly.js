import { StatusCodes } from "http-status-codes";

/**
 * 로그인하지 않은 유저만 콜백함수 호출
 */
const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.user) {
    return res.status(StatusCodes.OK).redirect("/");
  } else {
    next();
  }
};

export default publicOnlyMiddleware;
