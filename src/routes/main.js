const express = require("express");
const { getLogin, getIndex, getJoin } = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);
router.route("/login").get(getLogin);
router.route("/join").get(getJoin);

module.exports = router;
