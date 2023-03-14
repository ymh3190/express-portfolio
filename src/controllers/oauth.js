const { StatusCodes } = require("http-status-codes");

const github = (req, res) => {
  const params = `client_id=${process.env.GH_CLIENT}`;
  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.status(StatusCodes.OK).redirect(url);
};

const githubCallback = (req, res) => {};

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
