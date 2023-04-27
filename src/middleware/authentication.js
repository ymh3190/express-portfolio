import { UnauthorizedError } from "../errors/index.js";

/**
 * 유저가 로그인했는지 체크하는 미들웨어
 * 로그인하지 않았다면 401 에러를 던짐
 */
const authenticationMiddleware = (req, res, next) => {
  if (!req.session.user) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};
export default authenticationMiddleware;
