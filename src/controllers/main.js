const jwt = require("jsonwebtoken");
const mysql = require("../db/mysql");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const getIndex = (req, res) => {
  res.status(200).render("index", { pageTitle: "Index" });
};

const getLogin = (req, res) => {
  const { user } = req;
  if (user) {
    return res.status(200).end();
  }
  res.status(200).render("login", { pageTitle: "Login", user: null });
};

const authLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  } else if (
    !email.match(
      /^(\d+|\w+)([-_\.]?(\d+|\w+))*@(\d+|\w+)([-_\.]?(\d+|\w+))*\.(\w+){2,3}$/
    )
  ) {
    throw new BadRequestError("email is invalid");
  }
  mysql.query(
    "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?",
    [email, password],
    (err, results, fields) => {
      if (err) throw new BadRequestError("Bad Request");
      if (!results) throw new NotFoundError("Results does not exist");
      const token = jwt.sign(
        { id: results[0].id, email: results[0].email },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    }
  );
};

module.exports = { getIndex, getLogin, authLogin };
