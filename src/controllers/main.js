const { StatusCodes } = require("http-status-codes");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");

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
    // TODO: thorw err
  }

  //  TODO: email valid
  if (email.match()) {
  }

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

  const sql = "select id, email, name from users where email=?";
  mysql.query(sql, email, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: throw err
    // if (!user) throw new ;
    req.session.user = { ...user };
    res.status(StatusCodes.CREATED).redirect("/");
  });
};

const postLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;

  // TODO: email validation
  if (email.match()) {
  }

  const sql = "select * from users where email=?";
  mysql.query(sql, email, async (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: !user
    if (!user) {
    }

    try {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        // TODO: throw err
      }
      req.session.user = { ...user };
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
