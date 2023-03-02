const express = require("express");
const { getLogin, getIndex, authLogin } = require("../controllers/main");
const authenticationMiddleware = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/login").get(authenticationMiddleware, getLogin);
router.route("/api/auth").post(authLogin);

module.exports = router;
