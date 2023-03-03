const express = require("express");
const {
  getLogin,
  getIndex,
  authToken,
  postLogin,
  authLogin,
  getJoin,
  postJoin,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/login").get(getLogin).post(postLogin);
router.route("/api/auth").get(authLogin).post(authToken);
router.route("/join").get(getJoin).post(postJoin);

module.exports = router;
