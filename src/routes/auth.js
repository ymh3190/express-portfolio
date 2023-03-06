const express = require("express");
const { authToken } = require("../controllers/auth");
const router = express.Router();

router.route("/token").post(authToken);

module.exports = router;
