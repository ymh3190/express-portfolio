const express = require("express");
const { addHistory, getHistories } = require("../controllers/history");
const router = express.Router();

router.route("/").get(getHistories);
router.route("/api/:id(\\w{32})").post(addHistory);

module.exports = router;
