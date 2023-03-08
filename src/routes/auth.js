const express = require("express");
const { login, join } = require("../controllers/auth");
const router = express.Router();

router.route("/join").post(join);
router.route("/login").post(login);

module.exports = router;
