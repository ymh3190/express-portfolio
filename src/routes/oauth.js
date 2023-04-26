import express from "express";
import {
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
} from "../controllers/oauth.js";
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

export default router;
