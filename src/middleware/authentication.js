import { UnauthorizedError } from "../errors/index.js";

const authenticationMiddleware = (req, res, next) => {
  if (!req.session.user) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};
export default authenticationMiddleware;
