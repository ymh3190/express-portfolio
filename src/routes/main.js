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
const authenticationMiddleware = require("../middleware/authentication");
const publicOnlyMiddleware = require("../middleware/publicOnly");
const router = express.Router();
const rateLimiter = require("express-rate-limit")({
  windowMs: 60 * 1000 * 15,
  max: 100,
});

router.route("/").get(getIndex);
router
  .route("/join")
  .get(publicOnlyMiddleware, getJoin)
  .post(rateLimiter, join);
router
  .route("/login")
  .get(publicOnlyMiddleware, getLogin)
  .post(rateLimiter, login);
router.route("/search").get(search);
router
  .route("/find-password")
  .all(publicOnlyMiddleware)
  .get(getFindPassword)
  .post(findPassword);
router
  .route("/init-password")
  .all(authenticationMiddleware)
  .get(getInitPassword)
  .post(initPassword);
router.route("/watch/:id(\\w{32})").get(getWatch);

module.exports = router;
