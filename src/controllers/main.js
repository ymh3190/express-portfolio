const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");
const { BadRequestError, NotFoundError } = require("../errors");
const isEmail = require("../utils/isEmail");
const async_ = require("../middleware/async");
const sendMail = require("../utils/sendMail");

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

const join = async_(async (req, res) => {
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

const login = async_(async (req, res) => {
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

const getFindPassword = async_(async (req, res) => {
  res
    .status(StatusCodes.OK)
    .render("pages/password", { pageTitle: "Find password" });
});

const findPassword = async_(async (req, res) => {
  const {
    body: { email, authNumber },
  } = req;

  if (!email && !authNumber) {
    throw new BadRequestError("Provide email or authNumber");
  }

  if (email) {
    if (!isEmail(email)) {
      throw new BadRequestError("Email invalid");
    }
    const sql = "select email from users where email=?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      throw new NotFoundError("User not found");
    }
    req.session.email = email;
    await sendMail(req.session);
    res.status(StatusCodes.OK).redirect("/find-password");
  } else if (authNumber) {
    if (req.session.authNumber !== Number(authNumber)) {
      throw new BadRequestError("authNumber invalid");
    }
    const sql = "select * from users where email=?";
    const [results] = await mysql.query(sql, req.session.email);
    delete req.session.email;
    delete req.session.authNumber;
    const user = results[0];
    if (!user) {
      throw new NotFoundError("User not found");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect(`/init-password`);
  }
});

const getInitPassword = (req, res) => {
  res
    .status(StatusCodes.OK)
    .render("pages/password", { pageTitle: "Init Password" });
};

const initPassword = async_(async (req, res) => {
  const {
    body: { password, confirm },
  } = req;

  if (!password || !confirm) {
    throw new BadRequestError("Provide password and confirm password");
  }
  if (password !== confirm) {
    throw new BadRequestError("Password does not match confirm password");
  }
  const hash = await bcrypt.hash(password, 10);
  const sql = "update users set password=? where id=?";
  await mysql.query(sql, [hash, req.session.user.id]);
  delete req.session.user;
  res.status(StatusCodes.OK).redirect("/");
});

const getWatch = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql = "select * from videos where id=?";
  const [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "select * from comments where videoId=?";
  const [results_] = await mysql.query(sql, id);
  const comments = results_;
  res.status(StatusCodes.OK).render("pages/watch", {
    pageTitle: "Watch",
    video,
    comments: comments ? comments : null,
  });
});

module.exports = {
  getIndex,
  getJoin,
  getLogin,
  join,
  login,
  search,
  getFindPassword,
  findPassword,
  getInitPassword,
  initPassword,
  getWatch,
};
