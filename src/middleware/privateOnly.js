import { StatusCodes } from "http-status-codes";

const privateOnlyMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(StatusCodes.OK).redirect("/");
  }
};

export default privateOnlyMiddleware;
