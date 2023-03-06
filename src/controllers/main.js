const mysql = require("../db/mysql");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
};

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).render("pages/index", { pageTitle: "Index" });
};

module.exports = {
  getIndex,
  getLogin,
  getJoin,
};
