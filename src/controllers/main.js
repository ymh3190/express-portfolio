import { StatusCodes } from "http-status-codes";
import mysql from "../db/mysql.js";
import bcrypt from "bcryptjs";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import isEmail from "../utils/isEmail.js";
import async_ from "../middleware/async.js";
import sendMail from "../utils/sendMail.js";
import random from "../utils/randomFill.js";

export const getIndex = async_(async (req, res) => {
  const sql = "SELECT * FROM videos";
  const [results] = await mysql.query(sql);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/index", { pageTitle: "Index", videos });
});

export const getJoin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
};

export const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

export const join = async_(async (req, res) => {
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
  const sql =
    "INSERT INTO `users`(id, email, name, password) VALUES(?, ?, ?, ?)";
  await mysql.query(sql, [random(), email, name, hash]);
  res.status(StatusCodes.CREATED).redirect("/");
});

export const login = async_(async (req, res) => {
  const {
    body: { email, password },
  } = req;

  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  if (!isEmail(email)) {
    throw new BadRequestError("Email invalid");
  }

  const sql = "SELECT * FROM `users` WHERE `email` = ?";
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

export const search = async_(async (req, res) => {
  const {
    query: { query },
  } = req;

  const sql =
    "SELECT * FROM `videos` WHERE `title` LIKE ? OR `description` LIKE ?";
  const [results] = await mysql.query(sql, [`%${query}%`, `%${query}%`]);
  const videos = results;
  res
    .status(StatusCodes.OK)
    .render("pages/search", { pageTitle: "Search", videos });
});

export const getFindPassword = async_(async (req, res) => {
  res
    .status(StatusCodes.OK)
    .render("pages/password", { pageTitle: "Find password" });
});

export const findPassword = async_(async (req, res) => {
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
    const sql = "SELECT email FROM `users` WHERE `email` = ?";
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
    const sql = "SELECT * FROM `users` WHERE `email` = ?";
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

export const getInitPassword = (req, res) => {
  res
    .status(StatusCodes.OK)
    .render("pages/password", { pageTitle: "Init Password" });
};

export const initPassword = async_(async (req, res) => {
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
  const sql = "UPDATE `users` SET password = ? WHERE `id` = ?";
  await mysql.query(sql, [hash, req.session.user.id]);
  delete req.session.user;
  res.status(StatusCodes.OK).redirect("/");
});

export const getWatch = async_(async (req, res) => {
  const {
    params: { id },
  } = req;

  let sql = "SELECT * FROM `videos` WHERE `id` = ?";
  const [results] = await mysql.query(sql, id);
  const video = results[0];
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  sql = "SELECT * FROM `comments` WHERE `videoId` = ?";
  const [results_] = await mysql.query(sql, id);
  const comments = results_;
  res.status(StatusCodes.OK).render("pages/watch", {
    pageTitle: "Watch",
    video,
    comments,
  });
});
