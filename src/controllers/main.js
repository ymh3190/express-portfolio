const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");
const { BadRequestError } = require("../errors");
const isEmail = require("../utils/isEmail");

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).render("pages/index", { pageTitle: "Index" });
};

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
};

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

const postJoin = async (req, res) => {
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

  try {
    const hash = await bcrypt.hash(password, 10);

    let sql = "insert into users(email, name, password) values(?,?,?)";
    mysql.query(sql, [email, name, hash], (err, results) => {
      if (err) throw err;
    });

    sql = "select id, email, name from users where email=?";
    mysql.query(sql, email, (err, results) => {
      if (err) throw err;
      const user = results[0];
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .render("pages/error", { msg: "User not found" });
      }
      req.session.user = user;
      res.status(StatusCodes.CREATED).redirect("/");
    });
  } catch (err) {
    console.log(err);
  }
};

const postLogin = (req, res) => {
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
  mysql.query(sql, email, async (err, results) => {
    if (err) throw err;
    const user = results[0];
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .render("pages/error", { msg: "User not found" });
    }
    try {
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .render("pages/error", { msg: "Password invalid" });
      }
      req.session.user = user;
      delete req.session.user.password;
      res.status(StatusCodes.OK).redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  getIndex,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
};
