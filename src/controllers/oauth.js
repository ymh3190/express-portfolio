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
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});

const facebook = (req, res) => {
  const config = {
    client_id: process.env.FACEBOOK_ID,
    redirect_uri: `http://localhost:${process.env.PORT}/oauth/facebook/callback`,
    scope: "email public_profile",
    auth_type: "rerequest",
    state: "{st=state123abc,ds=123456789}",
  };

  const params = new URLSearchParams(config).toString();
  const url = `https://www.facebook.com/v13.0/dialog/oauth?${params}`;
  res.redirect(url);
};

const facebookCallback = async_(async (req, res) => {
  let config = {
    client_id: process.env.FACEBOOK_ID,
    redirect_uri: `http://localhost:${process.env.PORT}/oauth/facebook/callback`,
    client_secret: process.env.FACEBOOK_SECRET,
    code: req.query.code,
  };
  let params = new URLSearchParams(config).toString();
  let url = `https://graph.facebook.com/v13.0/oauth/access_token?${params}`;

  const response = await fetch(url);
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;

    config = {
      access_token,
      fields: "email,first_name,last_name,picture",
    };
    params = new URLSearchParams(config).toString();
    url = `https://graph.facebook.com/v13.0/me?${params}`;

    const data_ = await fetch(url);
    const { email, first_name, last_name, picture } = await data_.json();

    let sql = "select * from users where email=?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      sql =
        "insert into users(email, name, password, profilePhoto, social) values(?,?,?,?,?)";
      const [results_] = await mysql.query(sql, [
        email,
        `${first_name} ${last_name}`,
        await bcrypt.hash("", 10),
        picture,
        true,
      ]);
      const { insertId } = results_[0];
      const [results__] = await mysql.query(
        "select * from users id=?",
        insertId
      );
      const user_ = results__[0];
      req.session.user = user_;
      delete req.session.user.password;
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});

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
