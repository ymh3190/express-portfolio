const mysql = require("../db/mysql");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const getJoin = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "OK" });
  // res.status(StatusCodes.OK).render("pages/join", { pageTitle: "Join" });
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

  mysql.query("select * from users where email=?", email, (err, results) => {
    if (err) throw err;
    const user = results[0];
    // TODO: throw err
    // if (!user) throw new ;
    req.session.user = user;
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "CREATED", data: { user, session: req.session } });
  });
};

const getLogin = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "OK" });
  // res.status(StatusCodes.OK).render("pages/login", { pageTitle: "Login" });
};

const postLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;

  // TODO: email validation

  mysql.query(
    "select * from users where email=?",
    email,
    async (err, results) => {
      if (err) throw err;
      const user = results[0];
      // TODO: !user
      if (!user) {
      }
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
      }
      res.status(StatusCodes.OK).json({ msg: "OK", data: { user } });
    }
  );
};

module.exports = { getJoin, getLogin, postJoin, postLogin };
