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

router.route("/api/auth/token").post(authToken);

module.exports = router;
