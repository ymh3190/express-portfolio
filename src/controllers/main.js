const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");

const getIndex = (req, res) => {
  res.status(200).render("index", { pageTitle: "Index" });
};

const getLogin = (req, res) => {
  res.status(200).render("login", { pageTitle: "Login" });
};

module.exports = { getIndex, getLogin };
