import { StatusCodes } from "http-status-codes";

const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.user) {
    return res.status(StatusCodes.OK).redirect("/");
  } else {
    next();
  }
};

export default publicOnlyMiddleware;
