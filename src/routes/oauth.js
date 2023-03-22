const express = require("express");
const {
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
} = require("../controllers/oauth");
const router = express.Router();

router.route("/github").get(github);
router.route("/github/callback").get(githubCallback);
router.route("/facebook").get(facebook);
router.route("/facebook/callback").get(facebookCallback);
router.route("/google").get(google);
router.route("/google/callback").get(googleCallback);
router.route("/naver").get(naver);
router.route("/naver/callback").get(naverCallback);
router.route("/kakao").get(kakao);
router.route("/kakao/callback").get(kakaoCallback);

module.exports = router;
