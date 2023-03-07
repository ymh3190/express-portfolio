const express = require("express");
const { getIndex } = require("../controllers/main");
const router = express.Router();

router.route("/").get(getIndex);

module.exports = router;
