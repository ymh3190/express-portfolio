import express from "express";
import {
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
} from "../controllers/main.js";
import authenticationMiddleware from "../middleware/authentication.js";
import publicOnlyMiddleware from "../middleware/publicOnly.js";
import rateLimit from "express-rate-limit";
const rateLimiter = rateLimit({
  windowMs: 60 * 1000 * 15,
  max: 100,
});
const router = express.Router();

router.route("/").get(getIndex);
router
  .route("/join")
  .get(rateLimiter, publicOnlyMiddleware, getJoin)
  .post(join);
router
  .route("/login")
  .get(rateLimiter, publicOnlyMiddleware, getLogin)
  .post(login);
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

export default router;
