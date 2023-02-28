const express = require("express");
const { getLogin, getIndex, postLogin } = require("../controllers/main");
const authenticationMiddleware = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/login").get(getLogin);

module.exports = router;
