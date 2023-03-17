const { StatusCodes } = require("http-status-codes");
const async_ = require("../middleware/async");
const fetch = require("node-fetch");
const mysql = require("../db/mysql");
const bcrypt = require("bcryptjs");

const github = (req, res) => {
  const params = `client_id=${process.env.GITHUB_CLIENT}&scope=read:user`;
  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

const githubCallback = async_(async (req, res) => {
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://github.com/login/oauth/access_token?${params}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;
    const response_ = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const data_ = await response_.json();
    const { email, avatar_url, name } = data_;
    let sql = "select * from users where email=?";
    const [results] = await mysql.query(sql, email);
    let user = results[0];
    if (!user) {
      sql =
        "insert into users(email, name, password, profilePhoto, social) values(?,?,?,?,?)";
      const hash = await bcrypt.hash("", 10);
      const results_ = await mysql.query(sql, [
        email,
        name,
        hash,
        avatar_url,
        true,
      ]);
      const { insertId } = results_[0];
      sql = "select * from users where id=?";
      const [results__] = await mysql.query(sql, insertId);
      user = results__[0];
      req.session.user = user;
      delete req.session.user.password;
      return res.redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.redirect("/");
  }
});

const facebook = (req, res) => {};

const facebookCallback = (req, res) => {};

const google = (req, res) => {};

const googleCallback = (req, res) => {};

const naver = (req, res) => {};

const naverCallback = (req, res) => {};

const kakao = (req, res) => {};

const kakaoCallback = (req, res) => {};

module.exports = {
  github,
  githubCallback,
  facebook,
  facebookCallback,
  google,
  googleCallback,
  naver,
  naverCallback,
  kakao,
  kakaoCallback,
};
