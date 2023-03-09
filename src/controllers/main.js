const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");
const { BadRequestError, NotFoundError } = require("../errors");
const isEmail = require("../utils/isEmail");
const async_ = require("../middleware/async");

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).render("pages/index", { pageTitle: "Index" });
};

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
};

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

const postJoin = async_(async (req, res) => {
  const {
    body: { email, name, password, confirm },
  } = req;

  if (!email || !name || !password || !confirm) {
    throw new BadRequestError("Provide email, name, password and confirm");
  }

  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  if (password !== confirm) {
    throw new BadRequestError("Password does not match confirm password");
  }

  const hash = await bcrypt.hash(password, 10);
  const sql = "insert into users(email, name, password) values(?,?,?)";
  await mysql.query(sql, [email, name, hash]);
  res.status(StatusCodes.CREATED).redirect("/");
});

const postLogin = async_(async (req, res) => {
  const {
    body: { email, password },
    session,
  } = req;

  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  const sql = "select * from users where email=?";
  const [results] = await mysql.query(sql, email);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw new BadRequestError("Password invalid");
  }
  session.user = user;
  delete session.user.password;
  res.status(StatusCodes.OK).redirect("/");
});

module.exports = {
  getIndex,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
};
