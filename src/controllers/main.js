const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");
const { BadRequestError, NotFoundError } = require("../errors");
const isEmail = require("../utils/isEmail");
const async_ = require("../middleware/async");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const getIndex = async_(async (req, res) => {
  const sql = "select * from videos";
  const [results] = await mysql.query(sql);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/index", { pageTitle: "Index", videos });
});

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
  req.session.user = user;
  delete req.session.user.password;
  res.status(StatusCodes.OK).redirect("/");
});

const search = async_(async (req, res) => {
  const {
    query: { query },
  } = req;

  const sql = "select * from videos where title like ? or description like ?";
  const [results] = await mysql.query(sql, [`%${query}%`, `%${query}%`]);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/search", { pageTitle: "Search", videos });
});

const getFindEmail = async_(async (req, res) => {
  res.status(StatusCodes.OK).render("pages/email", { pageTitle: "Find email" });
});

const postFindEmail = async_(async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }
  const sql = "select password from users where email=?";
  const [results] = await mysql.query(sql, email);
  const user = results[0];
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw new BadRequestError("Password invalid");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.MAIL_ADDRESS,
    to: process.env.MAIL_ADDRESS,
    subject: "Hello ✔",
    // text or html
    // text: "text",
    html: "<b>html</b>",
  });
  res.status(StatusCodes.OK).json({ msg: "OK", info });
});

const findPassword = async_(async (req, res) => {
  res
    .status(StatusCodes.OK)
    .render("pages/password", { pageTitle: "Find password" });
});

module.exports = {
  getIndex,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
  search,
  getFindEmail,
  findPassword,
  postFindEmail,
};
