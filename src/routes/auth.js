const express = require("express");
const {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} = require("../controllers/auth");
const router = express.Router();

router.route("/join").get(getJoin).post(postJoin);
router.route("/login").get(getLogin).post(postLogin);

module.exports = router;
