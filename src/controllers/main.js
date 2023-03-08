const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const getIndex = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "OK", data: {} });
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

const postJoin = async (req, res) => {
  const {
    body: { email, name, password, confirm },
  } = req;

  if (!email || !name || !password || !confirm) {
    // TODO: thorw err
  }

  //  TODO: email valid
  // if(email.match()){}

  if (password !== confirm) {
    // TODO: thorw err
  }

  const hash = await bcrypt.hash(password, 10);

  // TODO: insert and select at the same time
  mysql.query(
    "insert into users(email, name, password) values(?,?,?)",
    [email, name, hash],
    (err, results) => {
      if (err) throw err;
    }
  );

  const sql = "select id, name from users where email=?";
  mysql.query(sql, email, async (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: throw err
    // if (!user) throw new ;
    const { id, name } = user;
    const url = `http://localhost:${process.env.PORT}/api/auth/join`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email }),
    });
    const data = await response.json();
    const { token } = data;
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "CREATED", data: { user: { id, email, name }, token } });
  });
};

const postLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;

  // TODO: email validation

  const sql = "select * from users where email=?";
  mysql.query(sql, email, async (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: !user
    if (!user) {
    }
    const { id, name } = user;

    try {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        // TODO: throw err
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const url = `http://localhost:${process.env.PORT}/api/auth/login`;
      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email }),
      });
      const data = await response.json();
      const { token } = data;
      res.status(StatusCodes.OK).json({
        msg: "OK",
        data: { user: { id, email, name }, token },
      });
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
