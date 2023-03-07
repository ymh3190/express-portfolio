const express = require("express");
const { login, dashboard, join } = require("../controllers/auth");
const authenticationMiddleware = require("../middleware/auth");
const router = express.Router();

router.route("/login").post(login);
router.route("/join").post(join);
router.route("/dashboard").get(authenticationMiddleware, dashboard);

module.exports = router;
