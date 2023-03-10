const express = require("express");
const {
  getIndex,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
  search,
  getFindEmail,
  findPassword,
  postFindEmail,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/join").get(getJoin).post(postJoin);
router.route("/login").get(getLogin).post(postLogin);
router.route("/search").get(search);
router.route("/find/email").get(getFindEmail).post(postFindEmail);
router.route("/find/password").get(findPassword);

module.exports = router;
