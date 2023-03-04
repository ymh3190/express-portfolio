const express = require("express");
const {
  getLogin,
  getIndex,
  getJoin,
  authToken,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/login").get(getLogin);
router.route("/join").get(getJoin);

router.route("/api/auth").post(authToken);
router.route("/api/login").post();

module.exports = router;
