const express = require("express");
const {
  getIndex,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/join").get(getJoin).post(postJoin);
router.route("/login").get(getLogin).post(postLogin);

module.exports = router;
