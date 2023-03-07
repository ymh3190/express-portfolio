const { StatusCodes } = require("http-status-codes");

const getIndex = (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ msg: "OK", data: { session: req.session } });
  // res.status(StatusCodes.OK).render("pages/index", { pageTitle: "Index" });
};

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "OK" });
  // res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
};

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "OK" });
  // res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

module.exports = { getIndex, getJoin, getLogin };
