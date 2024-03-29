import { StatusCodes } from "http-status-codes";
import async_ from "../middleware/async.js";
import fetch from "node-fetch";
import mysql from "../db/mysql.js";
import bcrypt from "bcryptjs";
import { socialOptions } from "../utils/social.js";
import random from "../utils/randomFill.js";

export const github = (req, res) => {
  const config = {
    client_id: socialOptions.github.client,
    cope: "read:user",
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

export const githubCallback = async_(async (req, res) => {
  const config = {
    client_id: socialOptions.github.client,
    client_secret: socialOptions.github.secret,
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
  const { access_token } = data;
  const response_ = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  const data_ = await response_.json();
  const { email, avatar_url, name } = data_;
  let sql = "SELECT * FROM `users` WHERE `email` = ?";
  const [results] = await mysql.query(sql, email);
  const user = results[0];
  if (!user) {
    sql = `
      INSERT INTO users(id, email, name, password, profilePhoto, social)
      VALUES(?, ?, ?, ?, ?, ?)`;
    const hash = await bcrypt.hash("", 10);
    const id = random();
    const values = [id, email, name, hash, avatar_url, true];
    await mysql.query(sql, values);
    sql = "SELECT * FROM `users` WHERE `id` = ?";
    const [results_] = await mysql.query(sql, id);
    const user_ = results_[0];
    req.session.user = user_;
    delete req.session.user.password;
    return res.status(StatusCodes.CREATED).redirect("/");
  }
  req.session.user = user;
  delete req.session.user.password;
  res.status(StatusCodes.OK).redirect("/");
});

export const facebook = (req, res) => {
  const config = {
    client_id: socialOptions.facebook.client,
    redirect_uri: "https://agliofolio.com/oauth/facebook/callback",
    scope: "email public_profile",
    auth_type: "rerequest",
    state: "{st=state123abc,ds=123456789}",
  };

  const params = new URLSearchParams(config).toString();
  const url = `https://www.facebook.com/v16.0/dialog/oauth?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

export const facebookCallback = async_(async (req, res) => {
  let config = {
    client_id: socialOptions.facebook.client,
    redirect_uri: "https://agliofolio.com/oauth/facebook/callback",
    client_secret: socialOptions.facebook.secret,
    code: req.query.code,
  };
  let params = new URLSearchParams(config).toString();
  let url = `https://graph.facebook.com/v16.0/oauth/access_token?${params}`;

  const response = await fetch(url);
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;

    config = {
      access_token,
      fields: "email,first_name,last_name,picture",
    };
    params = new URLSearchParams(config).toString();
    url = `https://graph.facebook.com/v16.0/me?${params}`;

    const data_ = await fetch(url);
    const { email, first_name, last_name, picture } = await data_.json();

    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      sql = `
      INSERT INTO users(id, email, name, password, profilePhoto, social)
      VALUES(?, ?, ?, ?, ?, ?)`;
      const hash = await bcrypt.hash("", 10);
      const id = random();
      const name = `${first_name} ${last_name}`;
      const values = [id, email, name, hash, picture.data.url, true];
      await mysql.query(sql, values);
      sql = "SELECT * FROM `users` WHERE `id` = ?";
      const [results_] = await mysql.query(sql, id);
      const user_ = results_[0];
      req.session.user = user_;
      delete req.session.user.password;
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});

export const google = (req, res) => {
  const config = {
    client_id: socialOptions.google.client,
    response_type: "code",
    state: "state_parameter_passthrough_value",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    access_type: "offline",
    redirect_uri: "https://agliofolio.com/oauth/google/callback",
    prompt: "consent",
    include_granted_scopes: true,
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

export const googleCallback = async_(async (req, res) => {
  const config = {
    code: req.query.code,
    client_id: socialOptions.google.client,
    client_secret: socialOptions.google.secret,
    redirect_uri: "https://agliofolio.com/oauth/google/callback",
    grant_type: "authorization_code",
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://oauth2.googleapis.com/token?${params}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;
    const url_ = "https://www.googleapis.com/oauth2/v2/userinfo";
    const response_ = await fetch(url_, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data_ = await response_.json();
    const { email, given_name, family_name } = data_;

    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      sql = `
      INSERT INTO users(id, email, name, password, profilePhoto, social)
      VALUES(?, ?, ?, ?, ?, ?)`;
      const hash = await bcrypt.hash("", 10);
      const id = random();
      const values = [id, email, `${given_name} ${family_name}`, hash, true];
      await mysql.query(sql, values);
      sql = "SELECT * FROM `users` WHERE `id` = ?";
      const [results_] = await mysql.query(sql, id);
      const user_ = results_[0];
      req.session.user = user_;
      delete req.session.user.password;
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});

export const naver = (req, res) => {
  const config = {
    response_type: "code",
    client_id: socialOptions.naver.client,
    redirect_uri: "https://agliofolio.com/oauth/naver/callback",
    state: "RANDOM_STATE",
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://nid.naver.com/oauth2.0/authorize?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

export const naverCallback = async_(async (req, res) => {
  const config = {
    grant_type: "authorization_code",
    client_id: socialOptions.naver.client,
    client_secret: socialOptions.naver.secret,
    redirect_uri: "https://agliofolio.com/oauth/naver/callback",
    code: req.query.code,
    state: req.query.state,
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://nid.naver.com/oauth2.0/token?${params}`;
  const response = await fetch(url);
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;
    const response_ = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data_ = await response_.json();
    const {
      response: { email, name, profile_image },
    } = data_;

    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      sql = `
      INSERT INTO users(id, email, name, password, profilePhoto, social)
      VALUES(?, ?, ?, ?, ?, ?)`;
      const hash = await bcrypt.hash("", 10);
      const id = random();
      await mysql.query(sql, [id, email, name, hash, profile_image, true]);
      sql = "SELECT * FROM `users` WHERE `id` = ?";
      const [results_] = await mysql.query(sql, id);
      const user_ = results_[0];
      req.session.user = user_;
      delete req.session.user.password;
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});

export const kakao = (req, res) => {
  const config = {
    client_id: socialOptions.kakao.client,
    redirect_uri: "https://agliofolio.com/oauth/kakao/callback",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://kauth.kakao.com/oauth/authorize?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

export const kakaoCallback = async_(async (req, res) => {
  const config = {
    grant_type: "authorization_code",
    client_id: socialOptions.kakao.client,
    redirect_uri: "https://agliofolio.com/oauth/kakao/callback",
    code: req.query.code,
    client_secret: socialOptions.kakao.secret,
  };
  const params = new URLSearchParams(config).toString();
  const url = `https://kauth.kakao.com/oauth/token?${params}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  const data = await response.json();

  if ("access_token" in data) {
    const { access_token } = data;
    const response_ = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data_ = await response_.json();
    const {
      kakao_account: {
        email,
        profile: { nickname, profile_image_url },
      },
    } = data_;

    let sql = "SELECT * FROM `users` WHERE `email` = ?";
    const [results] = await mysql.query(sql, email);
    const user = results[0];
    if (!user) {
      sql = `
      INSERT INTO users(id, email, name, password, profilePhoto, social)
      VALUES(?, ?, ?, ?, ?, ?)`;
      const hash = await bcrypt.hash("", 10);
      const id = random();
      const values = [id, email, nickname, hash, profile_image_url, true];
      await mysql.query(sql, values);
      sql = "SELECT * FROM `users` WHERE `id` = ?";
      const [results_] = await mysql.query(sql, id);
      const user_ = results_[0];
      req.session.user = user_;
      delete req.session.user.password;
      return res.status(StatusCodes.CREATED).redirect("/");
    }
    req.session.user = user;
    delete req.session.user.password;
    res.status(StatusCodes.OK).redirect("/");
  }
});
