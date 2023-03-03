const jwt = require("jsonwebtoken");
const mysql = require("../db/mysql");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const fetch = require("node-fetch");

const getIndex = (req, res) => {
  res.status(200).render("index", { pageTitle: "Index" });
};

const getLogin = (req, res) => {
  const { user } = req;
  if (user) {
    return res.status(200).end();
  }
  res.status(200).render("login", { pageTitle: "Login" });
};

const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  if (
    !email.match(
      /^(\d+|\w+)([-_\.]?(\d+|\w+))*@(\d+|\w+)([-_\.]?(\d+|\w+))*\.(\w+){2,3}$/
    )
  ) {
    throw new BadRequestError("email is invalid");
  }

  try {
    const url = `http://localhost:${process.env.PORT}/api/auth`;
    const data = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const { token } = await data.json();
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { id } = await response.json();
    mysql.query(
      "SELECT * FROM `users` WHERE `id` = ?",
      id,
      (err, results, fields) => {
        if (err) throw err;
        const user = results[0];
        req.user = user;
        res.status(200).redirect("/");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const authLogin = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Unauthenticated Error");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = decoded;
  res.status(200).json({ id });
};

const authToken = (req, res) => {
  const {
    body: { email, password },
  } = req;
  mysql.query(
    "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?",
    [email, password],
    (err, results, fields) => {
      if (err) throw err;
      if (!results) throw new NotFoundError("Results does not exist");
      const token = jwt.sign(
        { id: results[0].id, email: results[0].email },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    }
  );
};

module.exports = { getIndex, getLogin, authToken, authLogin, postLogin };
