const CustomAPIError = require("./custom-api");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const UnauthorizedError = require("./unauthorized");
const ForbiddenError = require("./forbidden");

module.exports = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
};
