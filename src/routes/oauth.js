const express = require("express");
const { github, githubCallback } = require("../controllers/oauth");
const router = express.Router();

router.route("/github").get(github);
router.route("/github/callback").get(githubCallback);

module.exports = router;
