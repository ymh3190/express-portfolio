const express = require("express");
const {
  getIndex,
  getJoin,
  getLogin,
  join,
  login,
  search,
  findPassword,
  getFindPassword,
  getInitPassword,
  initPassword,
  getWatch,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/join").get(getJoin).post(join);
router.route("/login").get(getLogin).post(login);
router.route("/search").get(search);
router.route("/find-password").get(getFindPassword).post(findPassword);
router.route("/init-password").get(getInitPassword).post(initPassword);
router.route("/watch/:id").get(getWatch);

module.exports = router;
